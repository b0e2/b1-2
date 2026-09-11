import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StudyLogCard from '../components/study-logs/StudyLogCard.jsx'
import DeleteLogDialog from '../components/study-logs/DeleteLogDialog.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ErrorState from '../components/ui/ErrorState.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import TagBadge from '../components/ui/TagBadge.jsx'
import { SearchIcon } from '../components/ui/icons.jsx'
import { useLogDeletion } from '../hooks/useLogDeletion.js'
import { useStudyLogs } from '../hooks/useStudyLogs.js'
import { filterStudyLogs, getTagCounts, sortStudyLogs } from '../lib/studyLogSelectors.js'

export default function TagsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  // 목록 화면과 같은 훅을 여기서 따로 부른다.
  // 공유 저장소를 두지 않아 이 화면도 자기 불러오는 중과 실패 상태를 갖는다.
  const { logs, isLoading, error, refetch, deletingId, mutationError, removeLog } = useStudyLogs()
  const deletion = useLogDeletion(removeLog)
  const goEdit = useCallback((item) => navigate(`/logs/${item.id}/edit`), [navigate])

  const selectedTag = searchParams.get('tag') ?? ''
  const [tagQuery, setTagQuery] = useState('')

  // 태그를 따로 저장하지 않고 기록에서 센다.
  // 기록을 지우거나 태그를 고치면 개수가 저절로 맞춰진다.
  const tagCounts = useMemo(() => getTagCounts(logs), [logs])

  const visibleTags = useMemo(() => {
    const needle = tagQuery.trim().toLowerCase()
    if (!needle) return tagCounts
    return tagCounts.filter(({ tag }) => tag.toLowerCase().includes(needle))
  }, [tagCounts, tagQuery])

  const taggedLogs = useMemo(
    () => (selectedTag ? sortStudyLogs(filterStudyLogs(logs, { tag: selectedTag }), 'recent') : []),
    [logs, selectedTag],
  )

  function selectTag(tag) {
    const next = new URLSearchParams(searchParams)
    if (tag) next.set('tag', tag)
    else next.delete('tag')
    setSearchParams(next)
  }

  // 불러오는 중에도 화면 제목은 남긴다. 제목까지 사라지면
  // 어느 화면에 있는지 알 수 없고 목록 화면과 동작이 달라진다.
  if (isLoading || error || logs.length === 0) {
    return (
      <>
        <TagsHeader />
        {isLoading ? <LoadingState message="태그를 불러오는 중입니다." /> : null}
        {error ? (
          <ErrorState
            message="태그를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
            onRetry={refetch}
          />
        ) : null}
        {!isLoading && !error ? (
          <EmptyState
            title="아직 태그가 없습니다."
            description="TIL을 작성하면 사용한 태그가 여기에 모입니다."
            actionLabel="새 TIL 작성"
            onAction={() => navigate('/logs/new')}
          />
        ) : null}
      </>
    )
  }

  return (
    <>
      <TagsHeader />

      <form className="toolbar__search tags__search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="tag-search" className="sr-only">
          태그 검색
        </label>
        <SearchIcon />
        <input
          id="tag-search"
          type="search"
          value={tagQuery}
          placeholder="태그를 검색해보세요. (예: React, JavaScript, 개발일지 …)"
          onChange={(event) => setTagQuery(event.target.value)}
        />
      </form>

      <section className="section section--tight">
        <h2 className="section__title section__title--sm">인기 태그</h2>
        {visibleTags.length === 0 ? (
          <p className="tags__none">“{tagQuery}” 와 맞는 태그가 없습니다.</p>
        ) : (
          <div className="filter-bar">
            {visibleTags.map(({ tag, count }) => (
              <TagBadge
                key={tag}
                tag={tag}
                count={count}
                selected={selectedTag.toLowerCase() === tag.toLowerCase()}
                onClick={() => selectTag(tag)}
              />
            ))}
          </div>
        )}
      </section>

      {selectedTag ? (
        <section className="section">
          <div className="section__head">
            <div>
              <h2 className="section__title">
                #{selectedTag} <span className="section__count">({taggedLogs.length})</span>
              </h2>
              <p className="section__description">#{selectedTag} 태그가 포함된 TIL 목록이에요.</p>
            </div>
            <button type="button" className="link" onClick={() => selectTag('')}>
              선택 해제
            </button>
          </div>

          {mutationError && !deletion.target ? (
            <p className="form__alert" role="alert">
              {mutationError}
            </p>
          ) : null}

          {taggedLogs.length === 0 ? (
            <EmptyState
              title="이 태그의 TIL이 없습니다."
              description="다른 태그를 골라보세요."
              actionLabel="선택 해제"
              onAction={() => selectTag('')}
            />
          ) : (
            <ul className="log-list">
              {taggedLogs.map((log) => (
                <li key={log.id}>
                  <StudyLogCard
                    log={log}
                    isDeleting={deletingId === log.id}
                    onEdit={goEdit}
                    onDelete={deletion.ask}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <p className="tags__hint">태그를 고르면 해당 TIL을 모아 보여드려요.</p>
      )}

      <DeleteLogDialog
        target={deletion.target}
        isDeleting={deletion.target?.id === deletingId}
        error={mutationError}
        onCancel={deletion.cancel}
        onConfirm={deletion.confirm}
      />
    </>
  )
}

function TagsHeader() {
  return (
    <PageHeader
      title="태그"
      description="태그로 TIL을 탐색해보세요. 관심 있는 주제의 배움을 한눈에 확인할 수 있어요."
    />
  )
}
