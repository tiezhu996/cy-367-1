import { useState, useEffect } from "react";
import type { Announcement, CreateAnnouncementRequest, UpdateAnnouncementRequest } from "../types";
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../api/client";

const emptyForm: CreateAnnouncementRequest = {
  title: "",
  content: "",
  isPinned: false,
  validFrom: new Date().toISOString().split("T")[0],
  validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  status: "published",
};

interface AnnouncementCenterProps {
  initialAnnouncements?: Announcement[];
  onClose?: () => void;
}

export function AnnouncementCenter({ initialAnnouncements = [], onClose }: AnnouncementCenterProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateAnnouncementRequest>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    if (initialAnnouncements.length === 0) {
      loadAnnouncements();
    }
  }, [initialAnnouncements.length]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await fetchAnnouncements();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      setError("加载公告列表失败，使用本地数据");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("标题和内容不能为空");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        const updated = await updateAnnouncement(editingId, formData as UpdateAnnouncementRequest);
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === editingId ? updated : a))
        );
      } else {
        const newAnnouncement = await createAnnouncement(formData);
        setAnnouncements((prev) => [newAnnouncement, ...prev]);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err) {
      setError("保存失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      isPinned: announcement.isPinned,
      validFrom: announcement.validFrom,
      validTo: announcement.validTo,
      status: announcement.status,
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("确定要删除这条公告吗？")) return;

    try {
      setLoading(true);
      await deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      setError(null);
    } catch (err) {
      setError("删除失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (announcement: Announcement) => {
    try {
      setLoading(true);
      const updated = await updateAnnouncement(announcement.id, {
        isPinned: !announcement.isPinned,
      });
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === announcement.id ? updated : a))
      );
      setError(null);
    } catch (err) {
      setError("操作失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (activeTab === "all") return true;
    return a.status === activeTab;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      draft: "草稿",
      published: "已发布",
      archived: "已归档",
    };
    return map[status] || status;
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      draft: "bg-ink/10 text-ink",
      published: "bg-emerald/10 text-emerald",
      archived: "bg-ink/5 text-ink/60",
    };
    return map[status] || "bg-ink/10 text-ink";
  };

  return (
    <div className="announcement-center">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black">公告中心</h2>
        <div className="flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-ink/20 text-ink hover:bg-ink/5"
            >
              返回
            </button>
          )}
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData(emptyForm);
            }}
            className="px-4 py-2 rounded-md bg-accent text-white font-bold hover:bg-accent/90"
          >
            发布公告
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red/10 text-red text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
          <div className="bg-paper rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "编辑公告" : "新建公告"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">公告标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-ink/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="请输入公告标题"
                  maxLength={200}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">公告内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-ink/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[120px]"
                  placeholder="请输入公告内容"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">生效日期</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-ink/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">失效日期</label>
                  <input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                    className="w-full px-4 py-2 border border-ink/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "draft" | "published" | "archived",
                      })
                    }
                    className="w-full px-4 py-2 border border-ink/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option value="draft">草稿</option>
                    <option value="published">发布</option>
                    <option value="archived">归档</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      className="w-5 h-5 accent-accent"
                    />
                    <span className="font-bold">置顶公告</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData(emptyForm);
                  }}
                  className="flex-1 px-4 py-2 rounded-md border border-ink/20 text-ink hover:bg-ink/5"
                  disabled={loading}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-md bg-accent text-white font-bold hover:bg-accent/90 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "保存中..." : editingId ? "更新" : "发布"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {(["all", "published", "draft"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-bold transition-colors ${
              activeTab === tab
                ? "bg-accent text-white"
                : "bg-ink/5 text-ink hover:bg-ink/10"
            }`}
          >
            {tab === "all" ? "全部" : tab === "published" ? "已发布" : "草稿"}
          </button>
        ))}
      </div>

      {loading && announcements.length === 0 ? (
        <div className="text-center py-8 text-ink/60">加载中...</div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="text-center py-8 text-ink/60">暂无公告</div>
      ) : (
        <div className="space-y-3">
          {filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="announcement-card flex items-start gap-4 p-4 rounded-lg border border-ink/10 bg-paper/80"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {announcement.isPinned && (
                    <span className="pill text-xs bg-accent/20 text-accent">
                      置顶
                    </span>
                  )}
                  <h4 className="font-bold truncate">{announcement.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(announcement.status)}`}>
                    {getStatusLabel(announcement.status)}
                  </span>
                </div>
                <p className="text-sm text-ink/70 mb-2 line-clamp-2">{announcement.content}</p>
                <div className="flex items-center gap-4 text-xs text-ink/50">
                  <span>有效期: {formatDate(announcement.validFrom)} ~ {formatDate(announcement.validTo)}</span>
                  <span>创建人: {announcement.createdBy}</span>
                  <span>创建时间: {formatDate(announcement.createdAt)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleTogglePin(announcement)}
                  className={`px-3 py-1 text-sm rounded ${
                    announcement.isPinned
                      ? "bg-accent/20 text-accent"
                      : "bg-ink/5 text-ink hover:bg-ink/10"
                  }`}
                >
                  {announcement.isPinned ? "取消置顶" : "置顶"}
                </button>
                <button
                  onClick={() => handleEdit(announcement)}
                  className="px-3 py-1 text-sm rounded bg-ink/5 text-ink hover:bg-ink/10"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="px-3 py-1 text-sm rounded bg-red/10 text-red hover:bg-red/20"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
