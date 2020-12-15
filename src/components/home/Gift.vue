<template>
    <div class="gift" :class="cssClasses">
        <div :class="{ 'h-32': !big, 'h-96': big }" class="h-32 gift__img rounded-xl">
            <img v-if="isClaimed" :src="giftUrl" class="object-cover w-full h-full rounded-xl"  alt="">
        </div>

        <div v-if="isClaimed" class="truncate gift__username whitespace-nowrap">
            {{ selectedByName }}
        </div>

        <slot></slot>
    </div>
</template>

<script>
import { computed, toRefs } from 'vue'
export default {
    props: {
        unwrappedGiftUrl: String,
        wrappedGiftUrl: {
            type: String,
            default: "../../assets/images/wrapped-gift.png"
        },
        stolenCount: Number,
        notAvailable: Boolean,
        selectedByName: String,
        selectedBy: String,
        big: Boolean
    },
    setup (props) {
        const { unwrappedGiftUrl, wrappedGiftUrl, selectedByName, big, stolenCount, notAvailable, selectedBy } = toRefs(props)
        
        const isClaimed = computed(() => {
            return selectedBy?.value !== "" && selectedBy?.value != null
        })

        // todo change
        const giftUrl = computed(() => {
            return isClaimed ? unwrappedGiftUrl.value : require(wrappedGiftUrl)
        })

        const cssClasses = {
            "gift--not-available": notAvailable.value,
            "gift--stolen": stolenCount?.value === 1,
            "gift--stolen-2": stolenCount?.value === 2,
            "w-32": !big.value,
            "w-96": big.value,
        }

        return {
            cssClasses,
            giftUrl,
            selectedByName,
            isClaimed
        }
    }
}
</script>

<style lang="scss" scoped>
    .gift {
        &__img {
            position: relative;
            background-image: url("../../assets/images/unwrapped-gift.png");
            background-size: contain;
            filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.5));
            cursor: pointer;
        }

        &--stolen, &--stolen-2 {
            .gift__img {
                &::before {
                    position: absolute;
                    content: '';
                    width: 100%;
                    height: 40%;
                    top: 0;
                    background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
                    font-size: 20px;
                    @apply rounded-xl;
                }

                &::after {
                    position: absolute;
                    padding: .25rem;
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    font-size: 20px;
                    top: 0;
                    right: 0;
                }
            }
        }

        &--stolen {
            .gift__img {
                &::after {
                    content: '\f057';
                }
            }
        }

        &--stolen-2 {
            .gift__img {
                &::after {
                    content: '\f057 \ \f057';
                }
            }
        }


        &--not-available {
            .gift__img {
                &::after {
                    position: absolute;
                    font-family: "Font Awesome 5 Free";
                    font-weight: 900;
                    content: "\f057";
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, .5);
                    display: grid;
                    place-items: center;
                    font-size: 48px;
                    // color: theme(colors.red.500);
                    @apply text-red-500 rounded-xl;
                }
            }
        }
    }
</style>
