import ActionIcons from './action-icons';
import LocationSelector from './location-selector';

const Header = () => {
  return (
    <header className="w-full bg-white">
      <div className="flex h-[60px] items-center justify-between px-4">
        <LocationSelector />
        <ActionIcons />
      </div>
    </header>
  );
};

export default Header;
