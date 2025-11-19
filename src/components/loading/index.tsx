import { Riple, LifeLine } from 'react-loading-indicators';
import type { RootState } from '../../libs/redux/store';
import './styles/components.loading.styles.main.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { serverUrl } from '../../App';

type Easing =
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear'
  | 'cubic-bezier(0.25, 0.1, 0.25, 1.0)'
  | 'cubic-bezier(0.42, 0.0, 1.0, 1.0)'
  | 'cubic-bezier(0.0, 0.0, 0.58, 1.0)'
  | 'cubic-bezier(0.42, 0.0, 0.58, 1.0)'
  | 'linear(0, 1)'
  | 'steps(4, end)'
  | (string & {});

interface LoadingInterface {
  color?: string;
  text?: string;
  textColor?: string;
  size?: any;
  easing?: Easing;
}

interface SmallLoadingInterface extends LoadingInterface {
  width: string;
  height: string;
}

function setDefaultLoadingConfig(props: LoadingInterface): LoadingInterface {
  let { color, size, text, textColor, easing } = props;

  if (!color) color = '#ffffff';
  if (!size) size = 'medium';
  if (!textColor) textColor = color;
  if (!text) text = 'Mengambil data';
  if (!easing) easing = 'ease-in-out';

  return { color, size, text, textColor, easing };
}

export function SmallLoading(props: SmallLoadingInterface) {
  let { color, size, textColor } = setDefaultLoadingConfig(props);
  const { width, height } = props;
  return (
    <div className="Small-Loading-Container" style={{ width, height }}>
      <Riple color={color} size={size} textColor={textColor} />
    </div>
  );
}

export function FirstLoading(props: LoadingInterface) {
  let { color, size, text, textColor, easing } = setDefaultLoadingConfig(props);

  const rootState = useSelector((state: RootState) => state.root);
  const [background, setBackground] = useState<string>('');

  function loadBg() {
    const bgUrl: string = `${serverUrl}/static/img/island-night-moon.jpg`;
    const bg = new Image();
    bg.onload = () => setBackground(bgUrl);
    bg.src = bgUrl;
  }

  useEffect(() => {
    loadBg();
  }, []);

  if (background.length < 1) return null;

  const containerClass = rootState.isLoading
    ? `First-Loading-Container First-Loading-Container-Active`
    : 'First-Loading-Container';

  const componentClass = rootState.isLoading
    ? 'Loading-Component Loading-Component-Active'
    : 'Loading-Component';

  return (
    <div
      className={containerClass}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="First-Loading-Box">
        <div className={componentClass}>
          <LifeLine
            color={color}
            easing={easing}
            size={size}
            text={text}
            textColor={textColor}
          />
        </div>
      </div>
    </div>
  );
}
