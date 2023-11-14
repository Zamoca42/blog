<template>
  <div
    ref="hero"
    :class="[
      'vp-blog-hero',
      { fullscreen: isFullScreen, 'no-bg': !bgInfo.image },
    ]"
  >
    <!-- Background -->
    <div
      v-if="!slots.heroBg"
      class="vp-blog-mask"
      :class="{ light: bgInfo.imageDark }"
      :style="[bgInfoStyles]"
    ></div>

    <!-- Hero Info -->
    <div v-if="!slots.heroInfo">
      <DropTransition :appear="true" type="group" :delay="0.04">
        <!-- Hero Image -->
        <div v-if="heroInfo.image">
          <img
            :key="heroInfo.imageDark ? 'dark' : 'light'"
            :class="['vp-blog-hero-image', { light: heroInfo.imageDark }]"
            :style="heroInfo.heroStyle"
            :src="heroInfo.image"
            :alt="heroInfo.alt"
          />
        </div>

        <!-- Hero Text -->
        <div v-if="heroInfo.text">
          <h1 class="vp-blog-hero-title">{{ heroInfo.text }}</h1>
        </div>

        <!-- Hero Tagline -->
        <div v-if="heroInfo.tagline">
          <p class="vp-blog-hero-description" v-html="heroInfo.tagline"></p>
        </div>
      </DropTransition>
    </div>

    <!-- Fullscreen Button -->
    <button
      v-if="heroInfo.isFullScreen"
      type="button"
      class="slide-down-button"
      @click="scrollToHero"
    >
      <SlideDownIcon />
      <SlideDownIcon />
    </button>
  </div>
</template>

<script>
import {
  usePageFrontmatter,
  useSiteLocaleData,
  withBase,
} from "@vuepress/client";
import { isString } from "@vuepress/shared";
import { computed, ref } from "vue";
import DropTransition from "@theme-hope/components/transitions/DropTransition";
import { SlideDownIcon } from "./icons/icons.js";
import defaultHeroBgImagePath from "../assets/hero.jpg";
import "../styles/blog-hero.scss";

export default {
  name: "CustomBlogHero",
  props: {
    slots: Object,
  },
  setup(props) {
    const frontmatter = usePageFrontmatter();
    const siteLocale = useSiteLocaleData();
    const hero = ref(null);

    const isFullScreen = computed(
      () => frontmatter.value.heroFullScreen ?? false
    );

    const heroInfo = computed(() => {
      const {
        heroText,
        heroImage,
        heroImageDark,
        heroAlt,
        heroImageStyle,
        tagline,
      } = frontmatter.value;

      return {
        text: heroText ?? siteLocale.value.title ?? "Hello",
        image: heroImage ? withBase(heroImage) : null,
        imageDark: heroImageDark ? withBase(heroImageDark) : null,
        heroStyle: heroImageStyle,
        alt: heroAlt || heroText || "hero image",
        tagline: tagline ?? "",
        isFullScreen: isFullScreen.value,
      };
    });

    const bgInfo = computed(() => {
      const { bgImage, bgImageDark, bgImageStyle } = frontmatter.value;

      return {
        image: isString(bgImage)
          ? withBase(bgImage)
          : bgImage === false
          ? null
          : defaultHeroBgImagePath,
        imageDark: isString(bgImageDark) ? withBase(bgImageDark) : null,
        bgStyle: bgImageStyle,
        isFullScreen: isFullScreen.value,
      };
    });

    const scrollToHero = () => {
      window.scrollTo({
        top: hero.value.clientHeight,
        behavior: "smooth",
      });
    };

    return {
      heroInfo,
      bgInfoStyles: {
        background: `url(${bgInfo.image}) center/cover no-repeat`,
        ...bgInfo.bgStyle,
      },
      isFullScreen,
      scrollToHero,
    };
  },
};
</script>
