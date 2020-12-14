<template>
    <div class="w-32 gift" :class="cssClasses">
        <div class="w-full h-32 gift__img rounded-xl"></div>
        <div class="truncate gift__username whitespace-nowrap">Firstname Lastname</div>
    </div>
</template>

<script>
import { toRefs } from 'vue'
export default {
    props: {
        unwrapped: Boolean,
        stolen: Number,
        notAvailable: Boolean
    },
    setup (props) {
        const { unwrapped, stolen, notAvailable } = toRefs(props)
        console.log(props);

        const cssClasses = {
            "gift--unwrapped": unwrapped.value,
            "gift--not-available": notAvailable.value,
            "gift--stolen": stolen?.value === 1,
            "gift--stolen-2": stolen?.value === 2
        }

        return {
            cssClasses
        }
    }
}
</script>

<style lang="scss" scoped>
    .gift {
        &__img {
            position: relative;
            background: url("../../assets/images/wrapped-gift.png") center center no-repeat;
            background-size: contain;
            filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.5));
        }

        &--unwrapped {
            .gift__img {
                background-image: url("../../assets/images/unwrapped-gift.png");
            }
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
