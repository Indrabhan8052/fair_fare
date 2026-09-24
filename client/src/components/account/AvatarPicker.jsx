const AVATARS = ['😊','😎','🧑','👩','🧔','👱','🧕','🧑‍💻','🧑‍🎓','👨‍✈️','🦸','🧙','🐯','🦊','🦁','🐻','🌟','🚀','🎯','🏆','🌈','⚡','🔥','💫'];

// Ported from pickAvatar()/the avatar grid in openEP()
export default function AvatarPicker({ value, onChange }) {
  return (
    <div className="avatar-grid">
      {AVATARS.map((av) => (
        <button
          key={av}
          type="button"
          className={`avatar-opt${av === value ? ' selected' : ''}`}
          onClick={() => onChange(av)}
        >
          {av}
        </button>
      ))}
    </div>
  );
}
