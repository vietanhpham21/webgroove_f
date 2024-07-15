<!-- Debug.svelte -->
<script>
    import {
      bpmStore, playStore, beatStore, gainDrumStore, panDrumStore, 
      activeDrumStore, soloDrumStore, muteDrumStore, effectDrumStore, 
      effectSynthStore, synthVolumeStore, synthPitchStore, synthPanStore, 
      synthAttack, synthDecay, synthSustain, synthRelease, projectId, 
      projectNameStore, projectIsPublic, description, projectLikes, 
      projectOwner, projectOwnerId, seqPatternIdStore, seqPatternNameStore, 
      drumPatternIdStore, drumPatternNameStore, wavetableIndexStore, 
      samplekitIndexStore,

      readOnlyMode

    } from '../stores';

  </script>
  
  <div>
    <p><strong>bpmStore</strong>: {$bpmStore}</p>
    <p><strong>playStore</strong>: {$playStore}</p>
    <p><strong>beatStore</strong>: {$beatStore}</p>
    <!-- <p><strong>gainDrumStore</strong>: {$gainDrumStore}</p>
    <p><strong>panDrumStore</strong>: {$panDrumStore}</p> -->
    <!-- <p><strong>activeDrumStore</strong>: {$activeDrumStore}</p>
    <p><strong>soloDrumStore</strong>: {$soloDrumStore}</p>
    <p><strong>muteDrumStore</strong>: {$muteDrumStore}</p>
    <p><strong>effectDrumStore</strong>: {$effectDrumStore}</p>
    <p><strong>effectSynthStore</strong>: {$effectSynthStore}</p>
    <p><strong>synthVolumeStore</strong>: {$synthVolumeStore}</p>
    <p><strong>synthPitchStore</strong>: {$synthPitchStore}</p>
    <p><strong>synthPanStore</strong>: {$synthPanStore}</p>
    <p><strong>synthAttack</strong>: {$synthAttack}</p>
    <p><strong>synthDecay</strong>: {$synthDecay}</p>
    <p><strong>synthSustain</strong>: {$synthSustain}</p>
    <p><strong>synthRelease</strong>: {$synthRelease}</p> -->
    <p><strong>projectId</strong>: {$projectId}</p>
    <p><strong>projectNameStore</strong>: {$projectNameStore}</p>
    <p><strong>projectIsPublic</strong>: {$projectIsPublic}</p>
    <p><strong>description</strong>: {$description}</p>
    <p><strong>projectLikes</strong>: {$projectLikes}</p>
    <p><strong>projectOwner</strong>: {$projectOwner}</p>
    <p><strong>projectOwnerId</strong>: {$projectOwnerId}</p>
    <p><strong>seqPatternIdStore</strong>: {$seqPatternIdStore}</p>
    <p><strong>seqPatternNameStore</strong>: {$seqPatternNameStore}</p>
    <p><strong>drumPatternIdStore</strong>: {$drumPatternIdStore}</p>
    <p><strong>readOnlyMode</strong>: {$readOnlyMode}</p>

    <!-- <p><strong>drumPatternNameStore</strong>: {$drumPatternNameStore}</p>
    <p><strong>wavetableIndexStore</strong>: {$wavetableIndexStore}</p>
    <p><strong>samplekitIndexStore</strong>: {$samplekitIndexStore}</p> -->
  </div>
  