import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getPosts, createPost, addComment, getComments } from '../services/storage';
import { Post } from '../types';
import { 
  Users, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sprout, 
  Store, 
  X,
  Share2,
  ThumbsUp
} from 'lucide-react';

export const CommunityScreen: React.FC = () => {
  const { currentUser, goToTab, viewProduct, refreshAll } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'kebutuhan' | 'ketersediaan'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // New Post Form State
  const [postType, setPostType] = useState<'ketersediaan' | 'kebutuhan'>(
    currentUser.role === 'petani' ? 'ketersediaan' : 'kebutuhan'
  );
  const [postCommodity, setPostCommodity] = useState('');
  const [postContent, setPostContent] = useState('');

  const posts = getPosts();

  const filteredPosts = posts.filter(p => {
    const matchType = filterType === 'all' || p.type === filterType;
    const matchSearch = p.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    createPost({
      communityId: 'comm-cabai',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorLocation: currentUser.location.split(',')[0],
      authorAvatarInitials: currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2),
      type: postType,
      commodity: postCommodity || 'Komoditas Umum',
      content: postContent,
    });

    setIsNewPostModalOpen(false);
    setPostContent('');
    setPostCommodity('');
    refreshAll();
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    addComment(postId, currentUser, newCommentText);
    setNewCommentText('');
    refreshAll();
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-3.5">
      {/* 1. Header Banner */}
      <section className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-1">
        <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider">
          Komunitas Tani &amp; Pedagang
        </span>
        <h1 className="text-[20px] font-bold text-[#1b1b1e] leading-snug">
          Forum Koordinasi Pasokan
        </h1>
        <p className="text-[13px] text-[#414940] leading-relaxed">
          Ruang koordinasi pasokan pangan, info kebutuhan pasar induk, dan pertukaran jadwal petik hasil panen.
        </p>
      </section>

      {/* 2. Search & Create Trigger Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#414940] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari obrolan pasokan atau kebutuhan..."
            className="w-full h-11 pl-10 pr-3.5 bg-white text-[#1b1b1e] rounded-xl text-[13px] border border-[#c1c9bd]/40 focus:outline-none focus:ring-2 focus:ring-[#1e5128] transition-all"
          />
        </div>
        <button
          onClick={() => setIsNewPostModalOpen(true)}
          className="h-11 px-3.5 bg-[#1e5128] hover:bg-[#013a13] text-white rounded-xl flex items-center justify-center gap-1.5 shrink-0 text-[13px] font-bold shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tulis Post</span>
        </button>
      </div>

      {/* 3. Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        <button
          onClick={() => setFilterType('all')}
          className={`h-8 px-3.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-[#1e5128] text-white shadow-xs'
              : 'bg-white text-[#414940] border border-[#c1c9bd]/40'
          }`}
        >
          Semua Obrolan ({posts.length})
        </button>
        <button
          onClick={() => setFilterType('kebutuhan')}
          className={`h-8 px-3.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filterType === 'kebutuhan'
              ? 'bg-[#fe932c] text-[#663500] font-bold shadow-xs'
              : 'bg-white text-[#414940] border border-[#c1c9bd]/40'
          }`}
        >
          Kebutuhan Pasokan
        </button>
        <button
          onClick={() => setFilterType('ketersediaan')}
          className={`h-8 px-3.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filterType === 'ketersediaan'
              ? 'bg-[#b8f1b9] text-[#002108] font-bold shadow-xs'
              : 'bg-white text-[#414940] border border-[#c1c9bd]/40'
          }`}
        >
          Ketersediaan Panen
        </button>
      </div>

      {/* 4. Feed Posts List */}
      <div className="flex flex-col gap-3.5">
        {filteredPosts.map((post) => {
          const isKebutuhan = post.type === 'kebutuhan';
          const comments = getComments(post.id);
          const isCommenting = activeCommentPostId === post.id;

          return (
            <div
              key={post.id}
              className="bg-white p-4 rounded-xl shadow-xs border border-[#c1c9bd]/30 space-y-3"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${
                    post.authorRole === 'petani' 
                      ? 'bg-[#b8f1b9] text-[#002108]' 
                      : 'bg-[#ffdcc3] text-[#2f1500]'
                  }`}>
                    {post.authorAvatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-bold text-[#1b1b1e]">
                        {post.authorName}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1e5128]" />
                    </div>
                    <p className="text-[11.5px] text-[#414940]">
                      {post.authorLocation} • {post.createdAt}
                    </p>
                  </div>
                </div>

                <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                  isKebutuhan 
                    ? 'bg-[#ffdcc3] text-[#6e3900]' 
                    : 'bg-[#b8f1b9] text-[#002108]'
                }`}>
                  {isKebutuhan ? 'Kebutuhan Pasokan' : 'Ketersediaan Panen'}
                </span>
              </div>

              {/* Commodity Tag */}
              <div className="inline-block bg-[#f5f3f6] text-[#1e5128] font-bold text-[12px] px-2.5 py-1 rounded-md">
                🌱 {post.commodity}
              </div>

              {/* Content Body */}
              <p className="text-[13.5px] text-[#1b1b1e] leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Specifications Tag Grid (if present) */}
              {post.specifications && (
                <div className="grid grid-cols-2 gap-2 bg-[#f5f3f6] p-3 rounded-lg text-[12px]">
                  {post.specifications.map((spec, i) => (
                    <div key={i}>
                      <span className="text-[11px] text-[#414940] block">{spec.label}</span>
                      <strong className="text-[#1b1b1e]">{spec.value}</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2 border-t border-[#c1c9bd]/20 flex items-center justify-between">
                <button
                  onClick={() => setActiveCommentPostId(isCommenting ? null : post.id)}
                  className="flex items-center gap-1.5 text-[12.5px] text-[#414940] hover:text-[#1e5128] font-semibold"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentsCount + comments.length} Balasan</span>
                </button>

                {isKebutuhan ? (
                  <button
                    onClick={() => goToTab('pasar')}
                    className="h-8 px-3 rounded-lg bg-[#1e5128] hover:bg-[#013a13] text-white font-bold text-[12px] flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Tawarkan Panen Saya</span>
                  </button>
                ) : (
                  <button
                    onClick={() => goToTab('pasar')}
                    className="h-8 px-3 rounded-lg bg-[#904d00] hover:bg-[#6e3900] text-white font-bold text-[12px] flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Lihat di Lapak Pasar</span>
                  </button>
                )}
              </div>

              {/* Comments Section */}
              {isCommenting && (
                <div className="pt-3 border-t border-[#c1c9bd]/20 space-y-3">
                  {comments.length > 0 && (
                    <div className="space-y-2 bg-[#f5f3f6] p-3 rounded-xl">
                      {comments.map((cmt) => (
                        <div key={cmt.id} className="text-[12px] space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#1b1b1e]">
                              {cmt.authorName} ({cmt.authorRole})
                            </span>
                            <span className="text-[10px] text-[#71796f]">{cmt.createdAt}</span>
                          </div>
                          <p className="text-[#414940]">{cmt.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Tulis tanggapan atau nomor kontak..."
                      className="flex-1 h-9 px-3 bg-[#f5f3f6] rounded-lg text-[12.5px] text-[#1b1b1e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1e5128]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="h-9 px-3 bg-[#1e5128] text-white font-bold text-[12px] rounded-lg flex items-center justify-center cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#c1c9bd]/20 pb-3">
              <h3 className="text-[16px] font-bold text-[#1b1b1e]">
                Buat Postingan Komunitas
              </h3>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1 text-[#414940] hover:text-[#1b1b1e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="text-[12px] font-bold text-[#1b1b1e] block mb-1">
                  Tipe Postingan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostType('ketersediaan')}
                    className={`h-10 rounded-xl text-[12px] font-bold transition-all ${
                      postType === 'ketersediaan'
                        ? 'bg-[#1e5128] text-white'
                        : 'bg-[#f5f3f6] text-[#414940]'
                    }`}
                  >
                    🌾 Ketersediaan Panen
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('kebutuhan')}
                    className={`h-10 rounded-xl text-[12px] font-bold transition-all ${
                      postType === 'kebutuhan'
                        ? 'bg-[#904d00] text-white'
                        : 'bg-[#f5f3f6] text-[#414940]'
                    }`}
                  >
                    📦 Kebutuhan Pasokan
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#1b1b1e] block mb-1">
                  Nama Komoditas
                </label>
                <input
                  type="text"
                  required
                  value={postCommodity}
                  onChange={(e) => setPostCommodity(e.target.value)}
                  placeholder="Contoh: Cabai Merah Keriting / Bawang Merah Bima"
                  className="w-full h-11 px-3.5 bg-[#f5f3f6] rounded-xl text-[13px] text-[#1b1b1e] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#1b1b1e] block mb-1">
                  Isi Postingan &amp; Rincian Kebutuhan / Panen
                </label>
                <textarea
                  rows={4}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Jelaskan volume, mutu, lokasi kebun/gudang, dan ketentuan transaksi yang diharapkan..."
                  className="w-full p-3 bg-[#f5f3f6] rounded-xl text-[13px] text-[#1b1b1e] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1e5128] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="h-10 px-4 rounded-xl bg-[#f0edf1] text-[#1b1b1e] text-[13px] font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#1e5128] hover:bg-[#013a13] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Terbitkan Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
