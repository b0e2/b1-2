import FormField from './FormField.jsx'

// 라벨과 입력을 한 번에 그린다.
// FormField 만 쓰면 화면마다 input 속성과 aria 연결을 열두 줄씩 반복해야 한다.
export default function TextField({
  as = 'input',
  id,
  name,
  label,
  value,
  error,
  hint,
  count,
  required = false,
  options,
  children,
  onChange,
  onBlur,
  ...rest
}) {
  const Tag = as === 'textarea' ? 'textarea' : as === 'select' ? 'select' : 'input'
  const fieldId = id ?? name

  return (
    <FormField id={fieldId} label={label} required={required} error={error} hint={hint} count={count}>
      {({ describedBy, invalid }) => (
        <Tag
          id={fieldId}
          name={name}
          className={as === 'textarea' ? 'input input--textarea' : 'input'}
          value={value}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          onChange={onChange}
          onBlur={onBlur}
          {...rest}
        >
          {as === 'select'
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </Tag>
      )}
    </FormField>
  )
}
