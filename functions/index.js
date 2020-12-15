const functions = require("firebase-functions")
const admin = require("firebase-admin")
const { user } = require("firebase-functions/lib/providers/auth")
const _shuffle = require("lodash/shuffle")

admin.initializeApp()
const firestore = admin.firestore()

exports.bootstrap = functions.https.onRequest(async (request, response) => {
    let eventRef = firestore.collection("events").doc("capps-2020")

    eventRef.set({
        name: "CAPPS WHITE ELEPHANT 2020",
        createdBy: "user-a",
        currentPlayer: null,
        maxSteals: 3,
        gameStarted: false
    })

    ////// Adding Users

    eventRef
        .collection("users")
        .doc("user-a")
        .set({
            imageUrl: "user-a.png",
            order: null,
            readyToPlay: false,
            selectedGift: false
        })

    eventRef
        .collection("gifts")
        .doc("user-a")
        .set({
            revealed: false,
            imageUrl: "user-a.png",
            description: "user-a toy"
        })

    eventRef
        .collection("users")
        .doc("user-b")
        .set({
            imageUrl: "user-b.png",
            order: null,
            readyToPlay: false,
            selectedGift: false
        })

    eventRef
        .collection("gifts")
        .doc("user-b")
        .set({
            revealed: false,
            imageUrl: "user-b.png",
            description: "user-b toy"
        })

    eventRef
        .collection("users")
        .doc("user-c")
        .set({
            imageUrl: "user-c.png",
            order: null,
            readyToPlay: false,
            selectedGift: false
        })

    eventRef
        .collection("gifts")
        .doc("user-c")
        .set({
            revealed: false,
            imageUrl: "user-c.png",
            description: "user-c toy"
        })

    eventRef
        .collection("users")
        .doc("user-d")
        .set({
            imageUrl: "user-d.png",
            order: null,
            readyToPlay: false,
            selectedGift: false
        })

    eventRef
        .collection("gifts")
        .doc("user-d")
        .set({
            revealed: false,
            imageUrl: "user-d.png",
            description: "user-d toy"
        })

    /// Everyone should be ready to go
    await new Promise(resolve => setTimeout(resolve, 3000))

    await eventRef.update({
        started: true
    })

    //game is now initialized, players have an order
    await new Promise(resolve => setTimeout(resolve, 3000))

    // let eventData = (await eventRef.get()).data()
    // let currentPlayer = eventData.currentPlayer

    // let giftsQuerySnapshop = await eventRef
    //     .collection("gifts")
    //     .where("revealed", "==", false)
    //     .limit(1)
    //     .get()

    // let docRef = giftsQuerySnapshop.docs[0]

    // eventRef
    //     .collection("gifts")
    //     .doc(docRef.id)
    //     .update({
    //         selectedBy: currentPlayer,
    //         revealed: true
    //     })

    // eventRef
    //     .collection("user")
    //     .doc(docRef.id)
    //     .update({
    //         selectedGift: true
    //     })

    functions.logger.info("Hello logs!", { structuredData: true })
    response.send("BOOTSTRAPPING")
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true })
    response.send("Hello from Firebase!")
})

exports.giftCreate = functions.firestore.document("events/{eventId}/gifts/{userId}").onCreate(async (doc, context) => {
    const data = doc.data()

    const eventId = context.params.eventId
    const userId = context.params.userId

    const eventRef = firestore.collection("events").doc(eventId)
    const usersQuery = eventRef.collection("users").doc(userId)

    if (data.unwrappedGiftUrl != null && data.unwrappedGiftUrl.trim() !== "") {
        usersQuery.set(
            {
                readyToPlay: true
            },
            { merge: true }
        )
    }
})

exports.giftUpdate = functions.firestore.document("events/{eventId}/gifts/{userId}").onUpdate(async (change, context) => {
    const before = change.before.data()
    const after = change.after.data()

    const eventId = context.params.eventId
    const userId = context.params.userId

    const eventRef = firestore.collection("events").doc(eventId)
    const usersQuery = eventRef.collection("users").doc(userId)

    if (before.unwrappedGiftUrl !== after.unwrappedGiftUrl) {
        if (after.unwrappedGiftUrl != null && after.unwrappedGiftUrl.trim() !== "") {
            usersQuery.set(
                {
                    readyToPlay: true
                },
                { merge: true }
            )
        } else {
            usersQuery.set(
                {
                    readyToPlay: false
                },
                { merge: true }
            )
        }
    }
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

    if (before.started !== after.started) {
        initializeGame(eventId)
    }
})
