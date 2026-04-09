let activeEffect = null;
const targetMap = new WeakMap();

function track(target, key, hooks = {}) {
  if (!activeEffect) {
    return;
  }

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let effects = depsMap.get(key);
  if (!effects) {
    effects = new Set();
    depsMap.set(key, effects);
  }

  effects.add(activeEffect);
  hooks.onTrack?.(`读取 ${String(key)} -> 收集依赖`);
}

function trigger(target, key, hooks = {}) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  const effects = depsMap.get(key);
  if (!effects) {
    return;
  }

  hooks.onTrigger?.(`修改 ${String(key)} -> 触发更新`);
  effects.forEach((effect) => effect());
}

export function reactiveVue3(source, hooks = {}) {
  return new Proxy(source, {
    get(target, key, receiver) {
      track(target, key, hooks);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      const result = Reflect.set(target, key, value, receiver);

      if (!Object.is(oldValue, value)) {
        trigger(target, key, hooks);
      }

      return result;
    },
  });
}

export function watchEffectVue3(effect) {
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
