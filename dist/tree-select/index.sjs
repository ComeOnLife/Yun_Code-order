import _array from "../wxs/array.sjs";

/* eslint-disable */
var array = _array;

function isActive(activeList, itemId) {
  if (array.isArray(activeList)) {
    return activeList.indexOf(itemId) > -1;
  }

  return activeList === itemId;
}

export var isActive = isActive;