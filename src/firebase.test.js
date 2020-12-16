import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing"

import { setup, teardown, getNormalFirestore, getAdminFirestore } from "./firebase-testing-helpers"

describe("Database rules", () => {
    // Applies only to tests in this describe block
    beforeAll(async () => {
        await setup()
    })

    afterEach(async () => {
        await teardown()
    })

    describe("gifts", () => {
        describe("read", () => {
            test("allow if the gift is yours and the event hasnt started", async () => {
                const adb = getAdminFirestore()

                await adb
                    .collection("events")
                    .doc("event-id")
                    .set({
                        started: false,
                        name: "white-elephant-2020"
                    })

                await adb.doc("events/event-id/gifts/kozo").set({
                    unwrappedUrl: "image.png",
                    selectedBy: null
                })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(await assertSucceeds(db.doc("events/event-id/gifts/kozo").get()))
            })

            test("allow if the gift is not yours but someone has claimed the item", async () => {
                const adb = getAdminFirestore()

                await adb
                    .collection("events")
                    .doc("event-id")
                    .set({
                        started: true,
                        name: "white-elephant-2020"
                    })

                await adb.doc("events/event-id/gifts/another-gift").set({
                    unwrappedUrl: "image.png",
                    selectedBy: "another-person"
                })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(await assertSucceeds(db.doc("events/event-id/gifts/another-gift").get()))
            })

            test("deny if the gift hasnt been selected and its not yours", async () => {
                const adb = getAdminFirestore()

                await adb
                    .collection("events")
                    .doc("event-id")
                    .set({
                        started: false,
                        name: "white-elephant-2020"
                    })

                await adb.doc("events/event-id/gifts/someone-else").set({
                    unwrappedUrl: "image.png",
                    selectedBy: null
                })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(await assertFails(db.doc("events/event-id/gifts/someone-else").get()))
            })
        })

        describe("create", () => {
            test("allow creating as long as its yours", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertSucceeds(
                        db.doc("events/event-id/gifts/kozo").set({
                            selectedBy: null
                        })
                    )
                )
            })

            test("deny creating gifts as other people", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertFails(
                        db.doc("events/event-id/gifts/someone-else").set({
                            selectedBy: null
                        })
                    )
                )
            })
        })

        describe("update", () => {
            test("allow updating your own gifts if the event hasnt started", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("event-id")
                    .set({
                        started: false,
                        name: "white-elephant-2020"
                    })

                adb.doc("events/event-id/gifts/kozo").set({
                    unwrappedGiftUrl: "altavista.png"
                })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertSucceeds(
                        db.doc("events/event-id/gifts/kozo").update({
                            unwrappedGiftUrl: "google.png"
                        })
                    )
                )
            })

            test("deny updating your own gifts if the event has started", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("event-id")
                    .set({
                        started: true,
                        name: "white-elephant-2020"
                    })

                adb.doc("events/event-id/gifts/kozo").set({
                    unwrappedGiftUrl: "altavista.png"
                })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertFails(
                        db.doc("events/event-id/gifts/kozo").update({
                            unwrappedGiftUrl: "google.png"
                        })
                    )
                )
            })

            test("allow updating someone elses gift if you are the current player and the item hasnt been stolen many times", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("event-id")
                    .set({
                        started: true,
                        name: "white-elephant-2020",
                        currentPlayer: "kozo",
                        maxSteals: 3
                    })

                adb.doc("events/event-id/gifts/someone-else").set({
                    selectedBy: null,
                    stolenCount: 0
                })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertSucceeds(
                        db.doc("events/event-id/gifts/someone-else").update({
                            selectedBy: "kozo"
                        })
                    )
                )
            })

            test("deny claiming an item if it has been stolen too many times", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("event-id")
                    .set({
                        started: true,
                        name: "white-elephant-2020",
                        currentPlayer: "kozo",
                        maxSteals: 3
                    })

                adb.doc("events/event-id/gifts/someone-else").set({
                    selectedBy: null,
                    stolenCount: 3
                })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertFails(
                        db.doc("events/event-id/gifts/someone-else").update({
                            selectedBy: "kozo"
                        })
                    )
                )
            })
        })
    })

    describe("users", () => {
        describe("read", () => {
            test("allow read if you're logged in", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                const ref = db.collection("events/event-id/users")

                expect(await assertSucceeds(ref.get()))
            })

            test("deny read if you're not logged in", async () => {
                const db = getNormalFirestore()

                const ref = db.collection("events/event-id/users")

                expect(await assertFails(ref.get()))
            })
        })

        describe("create", () => {
            test("allow if creating for yourself and event hasnt started", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("event-id")
                    .set({
                        started: false,
                        name: "white-elephant-2020"
                    })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertSucceeds(
                        db.doc("events/event-id/users/kozo").set({
                            wrappedGiftUrl: "google.png"
                        })
                    )
                )
            })

            test("deny if creating for yourself but event has started", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("event-id")
                    .set({
                        started: true,
                        name: "white-elephant-2020"
                    })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertFails(
                        db.doc("events/event-id/users/kozo").set({
                            wrappedGiftUrl: "google.png"
                        })
                    )
                )
            })

            test("deny if not creating for yourself", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("event-id")
                    .set({
                        started: false,
                        name: "white-elephant-2020"
                    })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertFails(
                        db.doc("events/event-id/users/fake-user").set({
                            wrappedGiftUrl: "google.png"
                        })
                    )
                )
            })
        })

        describe("update", () => {
            test("allow if updating for yourself and event hasnt started", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("event-id")
                    .set({
                        started: false,
                        name: "white-elephant-2020"
                    })

                adb.doc("events/event-id/users/kozo").set({
                    wrappedGiftUrl: "altavista.png"
                })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertSucceeds(
                        db.doc("events/event-id/users/kozo").update({
                            wrappedGiftUrl: "google.png"
                        })
                    )
                )
            })

            test("deny if updating for yourself but event has started", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("event-id")
                    .set({
                        started: true,
                        name: "white-elephant-2020"
                    })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertFails(
                        db.doc("events/event-id/users/kozo").update({
                            wrappedGiftUrl: "google.png"
                        })
                    )
                )
            })

            test("deny if not updating for yourself", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("event-id")
                    .set({
                        started: false,
                        name: "white-elephant-2020"
                    })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertFails(
                        db.doc("events/event-id/users/fake-user").update({
                            wrappedGiftUrl: "google.png"
                        })
                    )
                )
            })
        })
    })

    describe("events", () => {
        describe("read", () => {
            test("deny anon people to read events", async () => {
                const db = getNormalFirestore()

                const ref = db.collection("events")

                expect(await assertFails(ref.get()))
            })

            test("allow authenticated people to read events", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                const ref = db.collection("events")

                expect(await assertSucceeds(ref.get()))
            })
        })

        describe("create", () => {
            test("deny others from creating an event for another user", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertFails(
                        db.collection("events").add({
                            createdBy: "not-kozo"
                        })
                    )
                )
            })

            test("allow creation of event with valid fields", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertSucceeds(
                        db.collection("events").add({
                            createdBy: "kozo",
                            name: "white-elephant-2020",
                            maxSteals: 3,
                            currentPlayer: null
                        })
                    )
                )
            })
        })

        describe("update", () => {
            test("deny anyone from updating", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("kozo")
                    .set({
                        createdBy: "kozo",
                        name: "white-elephant-2020",
                        maxSteals: 3,
                        currentPlayer: null
                    })

                const db = getNormalFirestore({ uid: "not-kozo" })

                expect(
                    await assertFails(
                        db
                            .collection("events")
                            .doc("kozo")
                            .update({
                                name: "haha i hacked you"
                            })
                    )
                )
            })

            test("allow event admin to update event details", async () => {
                const adb = getAdminFirestore()

                adb.collection("events")
                    .doc("kozo")
                    .set({
                        createdBy: "kozo",
                        name: "white-elephant-2020",
                        maxSteals: 3,
                        currentPlayer: null
                    })

                const db = getNormalFirestore({ uid: "kozo" })

                expect(
                    await assertSucceeds(
                        db
                            .collection("events")
                            .doc("kozo")
                            .update({
                                name: "white-elephant-2021"
                            })
                    )
                )
            })
        })
    })
})
