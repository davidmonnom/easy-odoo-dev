/**
 * These globals are used across multiple components.
 */
const { Component, mount, xml, useEffect, useState, useRef } = owl;
const vscode = acquireVsCodeApi();

/**
 * Little hooks because t-on-change isn't allowed in VSC extensions.
 */
function useInputListener(event, el, callback) {
  useEffect(
    () => {
      if (!el?.el) {
        return;
      }

      const element = el.el;
      element.addEventListener(event, callback);
      return () => element.removeEventListener(event, callback);
    },
    () => [el]
  );
}

/**
 * Use to register callbacks for messages from the extension.
 * Supported message types are:
 * - load-settings
 * - load-databases
 * - server-state
 *
 * Each type can have multiple callbacks.
 * This is used to avoid using different event listeners for each message type.
 * And to avoid using addEventListener in components directly.
 */
const callbacks = {
  "load-settings": new Set(),
  "load-databases": new Set(),
  "server-state": new Set(),
  "load-available-modules": new Set(),
};

function registerCallback(type, callback) {
  const set = callbacks[type];
  if (!set) {
    throw new Error(`Unknown message type: ${type}`);
  }

  callbacks[type].add(callback);
  return () => unregisterCallback(type, callback);
}

function unregisterCallback(type, callback) {
  const set = callbacks[type];
  if (!set) {
    throw new Error(`Unknown message type: ${type}`);
  }

  callbacks[type].delete(callback);
}

function initListeners() {
  const handleMessage = (event) => {
    const message = event.data;

    if (callbacks[message.type]) {
      for (const cb of callbacks[message.type]) {
        cb(message.data);
      }
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}

initListeners();
