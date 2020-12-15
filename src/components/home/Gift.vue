<template>
    <div class="w-32 gift" :class="cssClasses">
        <div class="h-32 gift__img rounded-xl">
            <img v-if="isClaimed" :src="giftUrl" class="object-cover w-full h-full rounded-xl"  alt="">
        </div>
        <div v-if="isClaimed" class="truncate gift__username whitespace-nowrap">
            Firstname Lastname
        </div>
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
        displayName: String,
        selectedBy: String
    },
    setup (props) {
        const { unwrappedGiftUrl, wrappedGiftUrl, stolenCount, notAvailable, selectedBy } = toRefs(props)

        const isClaimed = computed(() => {
            // return selectedBy.value !== "" && selectedBy.value != null
            return true
        })

        // todo change
        const giftUrl = computed(() => {
            return isClaimed ? unwrappedGiftUrl.value : require(wrappedGiftUrl)
        })

        const cssClasses = {
            "gift--not-available": notAvailable.value,
            "gift--stolen": stolenCount?.value === 1,
            "gift--stolen-2": stolenCount?.value === 2
        }

        return {
            cssClasses,
            giftUrl,
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
