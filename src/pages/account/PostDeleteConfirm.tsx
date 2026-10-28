export function PostDeleteConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return <div className="post-delete-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onCancel() }}>
    <section className="post-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-post-title" aria-describedby="delete-post-description">
      <h2 id="delete-post-title">Delete this post?</h2>
      <p id="delete-post-description">This post will be removed from My Posts and its community feed. This action cannot be undone.</p>
      <div><button type="button" className="post-delete-cancel" onClick={onCancel}>Cancel</button><button type="button" className="post-delete-confirm" onClick={onConfirm}>Delete post</button></div>
    </section>
  </div>
}
