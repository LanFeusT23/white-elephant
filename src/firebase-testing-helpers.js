import {
    apps,
    loadFirestoreRules,
    initializeTestApp,
    clearFirestoreData,
    initializeAdminApp
} from "@firebase/rules-unit-testing"

import { projectId } from "../src/firebase"

import { readFileSync, readFile } from "fs"

export function getNormalFirestore(auth) {
    return initializeTestApp({
        projectId,
        auth
    }).firestore()
}

export function getAdminFirestore() {
    return initializeAdminApp({
        projectId
    }).firestore()
}

export async function setup(auth, data) {
    // Apply rules
    await loadFirestoreRules({
        projectId,
        rules: readFileSync("./firestore.rules", "utf8")
    })
}

export async function teardown() {
    //Promise.all(apps().map(app => app.delete()))
    await clearFirestoreData({ projectId })
}
