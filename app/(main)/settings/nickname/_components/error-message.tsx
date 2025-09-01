interface ErrorMessageProps {
  error: string;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;

  return (
    <p
      className="font-pretendard text-xs font-normal leading-[1.3333333333333333] text-wit-red"
      id="nickname-error"
      role="alert"
      aria-live="polite"
    >
      {error}
    </p>
  );
};

export default ErrorMessage;
