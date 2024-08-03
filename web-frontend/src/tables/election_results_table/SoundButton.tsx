import { useState } from 'react';
import { Howl } from 'howler';
import { MdVoiceOverOff, MdRecordVoiceOver } from "react-icons/md";
import msncElection2022 from '../../sounds/msnbc_election_2022.wav';

// Define sound outside of component function
const sound = new Howl({
  src: [msncElection2022],
  autoplay: false,
  loop: true,
  volume: 0.3,
  onend: function () {
    console.log('Finished!');
  }
});

function SoundButton({ type }: { type: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  let icon;
  switch (type) {
    case "on":
      icon = <MdVoiceOverOff color='#6B7280' />;
      break;
    case "off":
      icon = <MdRecordVoiceOver color='#6B7280' />;
      break;
    default:
      icon = null;
  }

  return (
    <div className='flex items-center bg-gray-200 p-2 pl-3 pr-3 rounded-sm hover:bg-gray-300'>
      <button onClick={() => {        
        if (type === "on") {
            if (!isPlaying) {
              sound.play();
              setIsPlaying(true);
            } else {
              sound.pause();
              setIsPlaying(false);
            }
        } else {
          sound.pause();
          setIsPlaying(false);
        }
      }}>
        <div>
          {icon}
        </div>
      </button>
    </div>
  );
}

export default SoundButton;
