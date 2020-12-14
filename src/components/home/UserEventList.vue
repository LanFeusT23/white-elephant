<template>
    <div class="p-8 pt-5 w-72 bg-red-1000 rounded-xl">
        <ol class="pl-10 list-decimal">
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg opacity-50">Firstname Lastname</li>
            <li class="relative text-lg active">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
            <li class="relative text-lg ">Firstname Lastname</li>
        </ol>
    </div>
</template>

<script>
export default {
    setup () {
        

        return {}
    }
}
</script>

<style lang="scss" scoped>
    .active {
        &::before {
            position: absolute;
            font-family: "Font Awesome 5 Free";
            font-weight: 900;
            content: "\f06b";
            left: -3.5rem;
            font-size: 1.5rem;
            @apply text-yellow-400;
        }
    }
</style>