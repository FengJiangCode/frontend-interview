let activeEffect = null;

function defineReactive(target, key, value, hooks = {}) {
  const effects = new Set();
  let internalValue = value;

  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (activeEffect) {
        effects.add(activeEffect);
        hooks.onTrack?.(`读取 ${String(key)} -> 收集依赖`);
      }
      return internalValue;
    },
    set(newValue) {
      if (Object.is(internalValue, newValue)) {
        return;
      }

      internalValue = newValue;
      hooks.onTrigger?.(`修改 ${String(key)} -> 触发更新`);
      effects.forEach((effect) => effect());
    },
  });
}

export function reactiveVue2(source, hooks = {}) {
  const target = {};

  Object.keys(source).forEach((key) => {
    defineReactive(target, key, source[key], hooks);
  });

  return target;
}

export function watchEffectVue2(effect) {
  const wrappedEffect = () => {
    activeEffect = wrappedEffect;
    try {
      effect();
    } finally {
      activeEffect = null;
    }
  };

  wrappedEffect();
  return wrappedEffect;
}
