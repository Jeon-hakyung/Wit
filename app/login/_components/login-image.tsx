import LoginCharacter from '@/assets/images/login-character.png';
import LoginLeftStarBig from '@/assets/images/login-left-star-big.png';
import LoginLeftStarSmall from '@/assets/images/login-left-star-small.png';
import LoginRightStar from '@/assets/images/login-right-star.png';
import Image from 'next/image';

const LoginImage = () => {
  return (
    <section
      className="flex h-[280px] w-[267.2px] items-center justify-center"
      aria-hidden="true"
      role="img"
      aria-label="로그인 이미지"
    >
      <div className="relative h-[280px] w-[267.2px]">
        <div className="absolute left-[16.75px] top-[0px] h-[258.25px] w-[250.45px]">
          <div className="absolute left-[0px] top-[48.73px] h-[25.34px] w-[26.31px]">
            <Image
              src={LoginLeftStarBig}
              alt="LoginLeftStarBig"
              width={26}
              height={25}
              className="object-contain"
              priority
              aria-hidden="true"
            />
          </div>
          <div className="absolute left-[16.57px] top-[0px] h-[56.52px] w-[58.47px] opacity-70">
            <Image
              src={LoginLeftStarSmall}
              alt="LoginLeftStarSmall"
              width={58}
              height={57}
              className="object-contain"
              aria-hidden="true"
            />
          </div>
          <div className="absolute left-[224.14px] top-[232.91px] h-[25.34px] w-[26.31px] opacity-50">
            <Image
              src={LoginRightStar}
              alt="LoginRightStar"
              width={26}
              height={25}
              className="object-contain"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="absolute left-[16.75px] top-[37px] h-[243px] w-[232px]">
          <Image
            src={LoginCharacter}
            alt="LoginCharacter"
            width={232}
            height={243}
            className="object-contain"
            priority
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default LoginImage;
