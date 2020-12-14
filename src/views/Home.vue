<template>
    <div class="flex mx-auto mt-24 gap-7 home">
        <UserSelectedGift></UserSelectedGift>

        <GiftsList></GiftsList>

        <UserEventList></UserEventList>
    </div>
</template>

<script>
import UserSelectedGift from "@/components/home/UserSelectedGift"
import GiftsList from "@/components/home/GiftsList"
import UserEventList from "@/components/home/UserEventList"
export default {
    name: "Home",

    setup() {

        return {
            UserSelectedGift,
            GiftsList,
            UserEventList
        }
    }
}
</script>