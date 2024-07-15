<script lang="ts">
  export let width = 15;
  export let height = 13;
  export let color = '#000000';


  $: widthPx = `${width}px`;
  $: heightPx = `${height}px`;


</script>


<svg style:width={widthPx} style:height={heightPx} viewBox="0 0 11 18" fill="none"> 
<path d="M2.0001 0L0.600098 1.5L8.0001 9L0.600098 16.5L2.0001 18L11.0001 9L2.0001 0Z" fill={color}/> 
</svg>
