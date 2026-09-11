import ConfirmDialog from '../ui/ConfirmDialog.jsx'

// 삭제 확인 문구를 한 곳에 둔다.
// 홈, 목록, 태그, 상세 네 화면이 같은 문장을 쓰므로 각자 적으면 갈린다.
export default function DeleteLogDialog({ target, isDeleting, error, onCancel, onConfirm }) {
  return (
    <ConfirmDialog
      open={Boolean(target)}
      title="이 TIL을 삭제할까요?"
      description={target ? `“${target.title}” 기록이 사라집니다. 되돌릴 수 없습니다.` : ''}
      confirmLabel="삭제"
      isProcessing={isDeleting}
      error={error}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
