const functions = require("firebase-functions")
const admin = require("firebase-admin")
const { user } = require("firebase-functions/lib/providers/auth")
const _shuffle = require("lodash/shuffle")

admin.initializeApp()
const firestore = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true })
    response.send("Hello from Firebase!")
})

async function initializeGame(eventId) {
    const eventRef = firestore.collection("events").doc(eventId)

    const usersQuery = await eventRef.collection("users").get()

    const ids = []

    usersQuery.forEach(userSnap => {
        ids.push(userSnap.id)
    })

    const randomizedIds = _shuffle(ids)

    randomizedIds.forEach((id, index) => {
        eventRef
            .collection("users")
            .doc(id)
            .update({
                order: index
            })
    })

    eventRef.update({
        currentPlayer: randomizedIds[0]
    })
}

exports.eventUpdated = functions.firestore.document("events/{eventId}").onUpdate(async (change, context) => {
    const before = change.before.data()
    const after = change.after.data()

    const eventId = context.params.eventId

    if (before.started !== after.started && after.started === true) {
        initializeGame(eventId)
    }
})

exports.giftUpdate = functions.firestore.document("events/{eventId}/gifts/{giftId}").onUpdate(async (change, context) => {
    const before = change.before.data()
    const after = change.after.data()

    const eventId = context.params.eventId
    const giftId = context.params.giftId

    const eventRef = firestore.collection("events").doc(eventId)

    //SELECTED BY CHANGES (PLAYER CHOSES A GIFT)
    if (before.selectedBy !== after.selectedBy && after.selectedBy != null) {
        //marks the person who just selected a gift
        await eventRef
            .collection("users")
            .doc(after.selectedBy)
            .update({
                selectedGift: true
            })

        if (before.selectedBy != null) {
            //A STEAL TOOK PLACE
            const giftsRef = eventRef.collection("gifts")

            await giftsRef.doc(giftId).update({
                stolenCount: admin.firestore.FieldValue.increment(1)
            })

            // const eventFinalRoundCheck = await (await eventRef.get()).data()

            // if (eventFinalRoundCheck.finalRound) {
            //     const currentUserPreviouslySelectedGift = await giftsRef
            //         .where("selectedBy", "==", after.selectedBy)
            //         .orderBy("updatedTimeStamp", "asc")
            //         .limit(1)
            //         .get()

            //     if (!currentUserPreviouslySelectedGift.empty) {
            //         const previousDoc = currentUserPreviouslySelectedGift.docs[0]

            //         await giftsRef.doc(previousDoc.id).update({
            //             selectedBy: null
            //         })
            //     }
            // }

            await eventRef.update({
                currentPlayer: before.selectedBy
            })
        } else {
            //gets the next player
            const nextPlayerSnap = await eventRef
                .collection("users")
                .where("selectedGift", "==", false)
                .orderBy("order")
                .limit(1)
                .get()

            if (!nextPlayerSnap.empty) {
                const nextPlayer = nextPlayerSnap.docs[0]

                //set the next player on the event
                eventRef.update({
                    currentPlayer: nextPlayer.id
                })
            } else {
                //ENABLE BONUS ROUND OF DEATH
                console.log("NO MORE")

                const firstPlayerSnap = await eventRef
                    .collection("users")
                    .orderBy("order")
                    .limit(1)
                    .get()

                if (!firstPlayerSnap.empty) {
                    const firstPlayer = firstPlayerSnap.docs[0]

                    const eventFinalRoundCheck = await (await eventRef.get()).data()

                    if (eventFinalRoundCheck.finalRound) {
                        eventRef.update({
                            currentPlayer: null
                        })
                    } else {
                        eventRef.update({
                            currentPlayer: firstPlayer.id,
                            finalRound: true
                        })
                    }
                }
            }
        }
    }
})
