<script lang="ts">
  export let width = 15;
  export let height = 13;
  export let color = '#000000';

  $: widthPx = `${width}px`;
  $: heightPx = `${height}px`;

</script>


<svg style:width={widthPx} style:height={heightPx} viewBox="0 0 11 18" fill="none">
<path d="M0 9L9 18L10.4 16.5L3 9L10.4 1.5L9 0L0 9Z" fill={color}/> 
</svg>
