<script lang="ts">
// @ts-nocheck

import { onMount, beforeUpdate, afterUpdate, createEventDispatcher } from 'svelte'
import {normalizeVal, clamp} from '../../utils'

  type Polarity = "Unipolar" | "Bipolar";
  let border_size = 2;
  let isDragging = false;
  const epsilon = 1e-9;
  export let size = 100;
  export let min = 0;
  export let max = 100;
  export let value = 100.0;
  export let steps = 10;
  export let polarity: Polarity = "Bipolar";
  export let resetVal: number = 0.0;
  export let id: string = "default";

  let radius;
  let startAngle;
  let endAngle;
  let angle;
  let endX;
  let endY;
  let mouseY: number;

  const dispatch = createEventDispatcher();


  // lifecycle function
  afterUpdate(() => {
    const knob = document.getElementById(id);
    const ctx = knob?.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, knob.width, knob.height);



    radius = size / 2;
    startAngle = 7 * Math.PI / 10;
    endAngle = 23 / 10 * Math.PI;
    angle = startAngle + normalizeVal(min, max, value) * 5.025;
    endX = radius + (size / 2 - size / 15) * Math.cos(angle);
    endY = radius + (size / 2 - size / 15) * Math.sin(angle);

    // knob body
    ctx.beginPath();
    ctx.fillStyle = '#41404E';
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    // knob ring
    ctx.beginPath();
    ctx.strokeStyle = '#D9D9D9';
    ctx.lineWidth = size / 30;
    ctx.lineCap = "round";
    ctx.arc(radius, radius, radius - size / 30, startAngle, endAngle);
    ctx.stroke();
    ctx.closePath();

    // knob line
    ctx.beginPath();
    ctx.strokeStyle = '#D9D9D9';
    ctx.lineWidth = size / 30;
    ctx.lineCap = "round";
    ctx.moveTo(radius, radius);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.closePath();

    // console.log(value);
    // console.log(value - 0 < epsilon);

    // green line
    ctx.beginPath();
    if (polarity === 'Unipolar') {
      ctx.strokeStyle = '#2BE127';
      ctx.lineWidth = size / 30;
      ctx.arc(radius, radius, radius - size / 30, startAngle, angle);
      ctx.stroke();
    } else if (polarity === 'Bipolar') {
      ctx.strokeStyle = '#2BE127';
      ctx.lineWidth = size / 30;
      ctx.arc(radius, radius, radius - size / 30, value - Math.floor(max / 2) < epsilon ? -Math.PI / 2 : 3 / 2 * Math.PI, angle, value - Math.floor(max / 2) < epsilon);
      ctx.stroke();
    }
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
      if (mouseY! < event.offsetY) {
        value -= steps;
      } else if (mouseY > event.offsetY) {
        value += steps;
      }
      value = clamp(min, max, value);
      dispatch('change', { value: value });
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

  const handleResetVal = (event: any) => {
    value = resetVal;
    dispatch('reset', {value: value});
  }


</script>


<canvas on:mousemove={handleMouseMove} 
        on:mouseup={handleMouseUp}
        on:mousedown={handleMouseDown}
        on:wheel={handleMouseWheel}
        on:dblclick={handleResetVal}
        id={id} 
        width={`${size}`}
        height={`${size}`}
        style="--border-size: {`${border_size}px`}">

</canvas>



<style>

  #knob {
    border: var(--border-size) solid #343434;
  }
</style>
