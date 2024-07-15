<script lang="ts">
  // @ts-nocheck
  import { onMount, beforeUpdate, afterUpdate, createEventDispatcher } from 'svelte';
  import {normalizeVal, clamp} from '../../utils';

  let border_size = 2;
  let isDragging = false;
  export let min = 0;
  export let max = 1.5;
  export let value = 1.3;
  export let steps = 0.1;
  export let id: string = "default";
  export let width: number = 30;
  export let height: number = 200;
  export let resetVal: number = 0.0;


  let mouseY;
  let mid;
  let bottom;

  const dispatch = createEventDispatcher();


  afterUpdate(() => {
    const slider = document.getElementById(id);
    const ctx = slider.getContext("2d");

    const normalizedValue = normalizeVal(min, max, value);

    const bottom_threshold = height - width / 2;
    const top_threshold = 0 + width / 2;

    mid = bottom_threshold - normalizeVal(min, max, value) * bottom_threshold;
    bottom = mid + width / 2;
    


    ctx.clearRect(0, 0, slider.width, slider.height);


    // line 
    ctx.beginPath();
    ctx.strokeStyle = "#D9D9D9";
    ctx.lineWidth = width / 5;
    ctx.lineCap = "round";
    ctx.moveTo(width / 2, height);
    ctx.lineTo(width / 2, 0);
    ctx.stroke();
    ctx.closePath();

    // green line
    ctx.beginPath();
    ctx.strokeStyle = "#2BE127";
    ctx.lineWidth = width / 5;
    ctx.lineCap = "round";
    ctx.moveTo(width / 2, height);
    ctx.lineTo(width / 2, bottom);
    ctx.stroke();
    ctx.closePath();

    // slider head 
    ctx.beginPath();
    ctx.fillStyle = "#323232";
    ctx.roundRect(0, mid - width / 2, width, width, [width / 5, width / 5, width / 5, width / 5]);
    ctx.fill();
    ctx.closePath();
  });

  const handleMouseUp = () => {
    isDragging = false;
  }

  const handleMouseDown = () => {
    isDragging = true;
  }

  const handleMouseMove = (event: any) => {
    if (isDragging) {
      if (mouseY! < event.offsetY && event.offsetY > bottom) {
        value -= steps;
      } else if (mouseY > event.offsetY && event.offsetY < mid - width / 2) {
        value += steps;
      }

      value = clamp(min, max, value);
      dispatch('change', { value: value});
    }
    mouseY = event.offsetY;
  }

  const handleMouseWheel = (event: any) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      value += steps;
    } else {
      value -= steps;
    }
    value = clamp(min, max, value);
    dispatch('change', {value: value});
  }

  const handleResetValue = (event: any) => {
    let top = mid - width / 2;
      value = resetVal;
      dispatch('reset', {value: value});
  }


</script>





<canvas id={id}
  width={`${width}`}
  height={`${height}`}
  style="--border-size: {`${border_size}px`}"
  on:mouseup={handleMouseUp}
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:wheel={handleMouseWheel}
  on:dblclick={handleResetValue}
> 

</canvas>




<style>

  #slider {
    border: var(--border-size) solid #ff0000;
  }

</style>
