// 라벨과 입력, 오류, 글자수를 한 덩어리로 묶는다.
// 오류가 있으면 입력 아래에 표시하고 aria-describedby 로 연결한다.
export default function FormField({ id, label, required = false, error, hint, count, children }) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={error ? 'field field--invalid' : 'field'}>
      <div className="field__head">
        <label htmlFor={id} className="field__label">
          {label}
          {required ? <span className="field__required" aria-hidden="true"> *</span> : null}
        </label>
        {count ? <span className="field__count">{count}</span> : null}
      </div>

      {/* 실제 입력은 호출하는 쪽이 넘긴다. id 와 aria 연결은 여기서 규칙을 정한다. */}
      {typeof children === 'function' ? children({ id, describedBy, invalid: Boolean(error) }) : children}

      {hint && !error ? (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
