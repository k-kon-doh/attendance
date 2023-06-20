<!-- リスト表示 base -->

<script setup lang="ts">
import type { DeepReadonly } from "vue";
import type { Attendance } from "composables/attendance";

interface Props {
  scrollPosition: number;
  pending: boolean;
  attendances: DeepReadonly<Attendance[]>;
}
const props = withDefaults(defineProps<Props>(), {
  scrollPosition: 0,
  pending: false,
  attendances: (): DeepReadonly<Attendance[]> => [],
});

interface Emits {
  (e: "scroll", value: number): void;
  (e: "dblclick", id: number): void;
}
const emits = defineEmits<Emits>();

const { helper } = helpAttendance();

const scrollElement = ref<HTMLDivElement | undefined>();
const { y: scrollY } = useScroll(scrollElement);

onMounted(() => {
  const stop = watch(scrollY, (value) => {
    emits("scroll", value);
  });
  onScopeDispose(stop);
  nextTick().then(() => (scrollY.value = props.scrollPosition));
});

onUpdated(() => {
  nextTick().then(() => (scrollY.value = props.scrollPosition));
});

const dblclickHandler: (id: number) => void = (id) => emits("dblclick", id);
</script>

<template>
  <v-sheet class="container-box mt-2" elevation="3">
    <v-table fixed-header hover>
      <template #wrapper>
        <div class="v-table__wrapper scroll-box" ref="scrollElement">
          <table>
            <thead>
              <tr>
                <slot name="head"></slot>
              </tr>
            </thead>
            <tbody>
              <tr v-for="attendance in props.attendances" :key="attendance.id!" @dblclick="dblclickHandler(attendance.id!)">
                <slot name="body" :attendance="helper(attendance)"></slot>
              </tr>
              <transition name="empty" appear>
                <tr v-if="props.attendances.length == 0 && !props.pending">
                  <slot name="empty"></slot>
                </tr>
              </transition>
            </tbody>
            <tfoot>
              <tr>
                <slot name="footer"></slot>
              </tr>
            </tfoot>
          </table>
        </div>
      </template>
    </v-table>
    <transition name="progress">
      <v-progress-circular indeterminate class="progress" v-if="pending" />
    </transition>
  </v-sheet>
</template>

<style scoped>
.container-box {
  position: relative;
}
.scroll-box {
  height: 500px;
  overflow: y-scroll;
}
.progress {
  color: orange;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
}
.progress-enter-active {
  animation: progress 250ms;
}
.progress-leave-active {
  animation: progress 250ms reverse;
}
@keyframes progress {
  0% {
    top: 0px;
  }
  100% {
    top: 20%;
  }
}
.empty-enter-active {
  animation: empty 1500ms;
}
@keyframes empty {
  0% {
    opacity: 0;
    visibility: hidden;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
}
</style>
