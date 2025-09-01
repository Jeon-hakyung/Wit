const Title = () => {
  return (
    <section
      className="flex flex-col items-center gap-2.5 font-gmarket-sans"
      aria-label="이제는 해외여행도 위트있게!"
    >
      <h1 className="w-[234px] text-center text-[25px] font-normal leading-[1em] tracking-[-0.02em] text-wit-black">
        이제는 해외여행도
      </h1>
      <p
        className="text-[27px] font-normal leading-[1em] tracking-[-0.02em] text-wit-orange"
        style={{
          WebkitTextStroke: '0.4px #FF5100',
        }}
      >
        위트있게!
      </p>
    </section>
  );
};

export default Title;
