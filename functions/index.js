const functions = require("firebase-functions")
const admin = require("firebase-admin")
const { user } = require("firebase-functions/lib/providers/auth")

admin.initializeApp()
const firestore = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true })
    response.send("Hello from Firebase!")
})

exports.giftCreated = functions.firestore.document("events/{eventId}/gifts/{userId}").onCreate(async (change, context) => {
    const eventId = context.params.eventId
    const userId = context.params.userId

    const eventRef = firestore.collection("events").doc(eventId)

    const event = await (await eventRef.get()).data()

    if (event.gameStarted === false) {
        eventRef
            .collection("users")
            .doc(userId)
            .set(
                {
                    readyToPlay: true
                },
                { merge: true }
            )
    }
})
