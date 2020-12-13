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
            test("deny others from creating an account for another user", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                const ref = expect(
                    await assertFails(
                        db.collection("events").add({
                            createdBy: "not-kozo"
                        })
                    )
                )
            })

            test("deny others from update an account for another user", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                const ref = expect(
                    await assertFails(
                        db
                            .collection("events")
                            .doc("fake-event-id")
                            .set({
                                createdBy: "not-kozo"
                            })
                    )
                )
            })

            test("allow creation of event with valid fields", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                const ref = expect(
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

            test("deny really long event names names", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                const ref = expect(
                    await assertFails(
                        db.collection("events").add({
                            createdBy: "kozo",
                            name: new Array(101).fill("x").join(""),
                            maxSteals: 3,
                            currentPlayer: null
                        })
                    )
                )
            })
        })

        describe("update", () => {
            test("deny anyone from updated the created by field", async () => {
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

                const ref = expect(
                    await assertFails(
                        db.collection("events").add({
                            createdBy: "not kozo",
                            name: "white-elephant-2021",
                            maxSteals: 2,
                            currentPlayer: "kozo"
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

                const ref = expect(
                    await assertSucceeds(
                        db
                            .collection("events")
                            .doc("kozo")
                            .set(
                                {
                                    createdBy: "kozo",
                                    name: "white-elephant-2021"
                                },
                                { merge: true }
                            )
                    )
                )
            })
        })
    })

    describe("users", () => {
        describe("read", () => {
            test("allow authenticated users to read the users", async () => {
                const db = getNormalFirestore({ uid: "kozo" })

                const ref = db.collection("users")

                expect(await assertSucceeds(ref.get()))
            })

            test("deny un-authed users from reading the users", async () => {
                const db = getNormalFirestore()

                const ref = db.collection("users")

                expect(await assertFails(ref.get()))
            })
        })

        describe("write", () => {
            it("allow people to create their own user document", async () => {
                const adb = getAdminFirestore()

                const db = getNormalFirestore({ uid: "kozo" })

                const ref = expect(
                    await assertSucceeds(
                        db
                            .collection("users")
                            .doc("kozo")
                            .set(
                                {
                                    foo: "bar"
                                },
                                { merge: true }
                            )
                    )
                )
            })
        })
    })
})
