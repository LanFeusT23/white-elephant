<template>
    <div class="gift" :class="cssClasses">
        <slot name="header"></slot>

        <div :class="{ 'h-32': !big, 'h-96': big }" class="h-32 gift__img filter-shadow rounded-xl bg-red-1000">
            <img :src="giftUrl" class="object-cover w-full h-full rounded-xl" alt="" />
        </div>

        <div v-if="isClaimed" class="truncate gift__username whitespace-nowrap">
            {{ selectedByName }}
        </div>

        <slot name="footer"></slot>
    </div>
</template>

<script>
import { computed, toRefs } from "vue"
export default {
    props: {
        id: String,
        stolenCount: Number,
        notAvailable: Boolean,
        selectedByName: String,
        selectedBy: String,
        big: Boolean,
        isClaimed: Boolean,
        giftUrl: String,
    },
    setup(props) {
        const { id, giftUrl, isClaimed, selectedByName, big, stolenCount, notAvailable } = toRefs(props)

        const cssClasses = computed(() => {
            return {
                "gift--not-available": notAvailable.value,
                "gift--stolen": stolenCount?.value === 1,
                "gift--stolen-2": stolenCount?.value === 2,
                "w-32": !big.value,
                "w-96": big.value,
            }
        })

        return {
            cssClasses,
            giftUrl,
            selectedByName,
            isClaimed,
            id,
        }
    },
}
</script>

<style lang="scss" scoped>
.gift {
    &__img {
        position: relative;
        cursor: pointer;
    }

    &--stolen,
    &--stolen-2 {
        .gift__img {
            &::before {
                position: absolute;
                content: "";
                width: 100%;
                height: 50%;
                bottom: 0;
                background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
                font-size: 20px;
                @apply rounded-xl;
            }

            &::after {
                font-family: "Font Awesome 5 Free";
                font-weight: 900;
                font-size: 20px;
                @apply bottom-0 left-0 p-1 absolute text-red-600;
            }
        }
    }

    &--stolen {
        .gift__img {
            &::after {
                content: "\f057";
            }
        }
    }

    &--stolen-2 {
        .gift__img {
            &::after {
                content: "\f057 \ \f057";
            }
        }
    }

    &--not-available {
        .gift__img {
            &::after {
                font-family: "Font Awesome 5 Free";
                font-weight: 900;
                content: "\f057";
                background: rgba(0, 0, 0, 0.5);
                font-size: 48px;
                @apply text-red-500 rounded-xl top-0 left-0 bottom-0 right-0 grid place-items-center absolute;
            }
        }
    }

    &__username {
        filter: drop-shadow(4px 4px 8px black)
    }
}
</style>
