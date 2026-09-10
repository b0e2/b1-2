import Button from '../ui/Button.jsx'
import FormField from '../ui/FormField.jsx'
import TagInput from './TagInput.jsx'
import {
  DURATION_MINUTES_MAX,
  DURATION_MINUTES_MIN,
  TAGS_MAX,
} from '../../lib/studyLogValidation.js'
import { formatUnderstanding } from '../../lib/studyLogFormatters.js'

const UNDERSTANDING_LEVELS = [1, 2, 3, 4, 5]

// 값과 오류를 모두 바깥에서 받는다. Supabase 를 모르고 스스로 저장하지 않는다.
// 그래서 등록과 수정이 같은 컴포넌트를 쓴다.
export default function StudyLogForm({
  values,
  errors,
  touched = {},
  isSubmitting,
  submitError,
  submitLabel = '저장',
  today,
  tagSuggestions = [],
  onChange,
  onBlur,
  onTagsChange,
  onSubmit,
  onCancel,
}) {
  // 아직 건드리지 않은 필드의 오류는 제출 전까지 보여주지 않는다.
  const shown = (name) => (touched[name] ? errors[name] : undefined)

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {submitError ? (
        <p className="form__alert" role="alert">
          {submitError}
        </p>
      ) : null}

      <section className="form__card">
        <h2 className="form__card-title">무엇을 배웠나요</h2>

        <FormField id="title" label="제목" required error={shown('title')} count={`${values.title.length}/80`}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="title"
              type="text"
              className="input"
              value={values.title}
              maxLength={80}
              placeholder="오늘 배운 것을 한 줄로 적어주세요"
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy || undefined}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        </FormField>

        <FormField
          id="tags"
          label="태그"
          required
          error={shown('tags')}
          hint={`엔터나 쉼표로 확정합니다. 최대 ${TAGS_MAX}개.`}
        >
          <TagInput
            tags={values.tags}
            maxTags={TAGS_MAX}
            error={shown('tags')}
            suggestions={tagSuggestions}
            onChange={onTagsChange}
          />
        </FormField>

        <FormField id="study_date" label="학습한 날짜" required error={shown('study_date')}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="study_date"
              type="date"
              className="input"
              value={values.study_date}
              max={today}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy || undefined}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        </FormField>
      </section>

      <section className="form__card">
        <h2 className="form__card-title">배운 내용</h2>

        <FormField
          id="content"
          label="학습 내용"
          required
          error={shown('content')}
          count={`${values.content.length}/3000`}
        >
          {({ id, describedBy, invalid }) => (
            <textarea
              id={id}
              name="content"
              className="input input--textarea"
              rows={8}
              value={values.content}
              maxLength={3000}
              placeholder="무엇을 어떻게 이해했는지 적어주세요"
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy || undefined}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        </FormField>

        <FormField id="resource_url" label="참고 링크" error={shown('resource_url')} hint="선택 항목입니다.">
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="resource_url"
              type="url"
              className="input"
              value={values.resource_url}
              placeholder="https://"
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy || undefined}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        </FormField>
      </section>

      <section className="form__card">
        <h2 className="form__card-title">학습 상태</h2>

        <div className="form__row">
          <FormField id="duration_minutes" label="학습 시간(분)" required error={shown('duration_minutes')}>
            {({ id, describedBy, invalid }) => (
              <input
                id={id}
                name="duration_minutes"
                type="number"
                className="input"
                value={values.duration_minutes}
                min={DURATION_MINUTES_MIN}
                max={DURATION_MINUTES_MAX}
                step={5}
                placeholder="60"
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy || undefined}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          </FormField>

          <FormField id="understanding" label="이해도" required error={shown('understanding')}>
            {({ id, describedBy, invalid }) => (
              <select
                id={id}
                name="understanding"
                className="input"
                value={values.understanding}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy || undefined}
                onChange={onChange}
                onBlur={onBlur}
              >
                {UNDERSTANDING_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level} · {formatUnderstanding(level)}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            name="is_completed"
            checked={values.is_completed}
            onChange={onChange}
            onBlur={onBlur}
          />
          학습을 마쳤어요
        </label>

        {/* 완료로 표시할 때만 회고를 필수로 받는다.
            기록과 회고를 함께 남기는 것이 이 서비스의 목적이다. */}
        <FormField
          id="reflection"
          label="회고"
          required={values.is_completed}
          error={shown('reflection')}
          hint={values.is_completed ? '완료로 표시하려면 10자 이상 적어주세요.' : '선택 항목입니다.'}
          count={`${values.reflection.length}/2000`}
        >
          {({ id, describedBy, invalid }) => (
            <textarea
              id={id}
              name="reflection"
              className="input input--textarea"
              rows={4}
              value={values.reflection}
              maxLength={2000}
              placeholder="어려웠던 점이나 다음에 해볼 것을 적어주세요"
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy || undefined}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        </FormField>
      </section>

      <div className="form__actions">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
        ) : null}
        <Button type="submit" variant="primary" isLoading={isSubmitting} loadingLabel="저장 중">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
