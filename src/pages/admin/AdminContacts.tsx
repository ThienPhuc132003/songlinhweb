import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, type Contact } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DataTable,
  PageHeader,
  ConfirmDelete,
  type Column,
} from "@/components/admin/CrudHelpers";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: "Mới", color: "bg-primary/10 text-primary" },
  read: { label: "Đã đọc", color: "bg-yellow-100 text-yellow-700" },
  replied: { label: "Đã trả lời", color: "bg-green-100 text-green-700" },
  archived: { label: "Lưu trữ", color: "bg-slate-100 text-slate-500" },
};

export default function AdminContacts() {
  const qc = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "contacts"],
    queryFn: adminApi.contacts.list,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.contacts.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "contacts"] });
      toast.success("Đã cập nhật trạng thái");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.contacts.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "contacts"] });
      setDeleteTarget(null);
      toast.success("Đã xóa");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateStatus = (contact: Contact, status: string) => {
    statusMutation.mutate({ id: contact.id, status });
    if (selectedContact?.id === contact.id) {
      setSelectedContact({ ...contact, status: status as Contact["status"] });
    }
  };

  const columns: Column<Contact>[] = [
    { key: "id", header: "ID", className: "w-16" },
    {
      key: "company_name",
      header: "Liên hệ",
      render: (r) => (
        <div>
          <p className="font-medium">{r.company_name}</p>
          <p className="text-muted-foreground text-xs">
            {r.contact_person} · {r.email}
          </p>
        </div>
      ),
    },
    { key: "phone", header: "SĐT", className: "w-32" },
    {
      key: "message",
      header: "Nội dung",
      render: (r) => (
        <p className="line-clamp-1 max-w-[200px] text-sm">{r.message}</p>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      className: "w-28",
      render: (r) => {
        const s = statusLabels[r.status] || statusLabels.new;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}
          >
            {s.label}
          </span>
        );
      },
    },
    {
      key: "created_at",
      header: "Ngày gửi",
      className: "w-28",
      render: (r) => new Date(r.created_at).toLocaleDateString("vi-VN"),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hộp thư liên hệ"
        description="Quản lý tin nhắn từ khách hàng"
      />

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        searchField="company_name"
        onEdit={(row) => {
          setSelectedContact(row);
          // Auto mark as read when opening
          if (row.status === "new") {
            statusMutation.mutate({ id: row.id, status: "read" });
          }
        }}
        onDelete={setDeleteTarget}
      />

      {/* Contact detail dialog */}
      <Dialog
        open={!!selectedContact}
        onOpenChange={() => setSelectedContact(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết liên hệ</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Công ty:</span>
                  <p className="font-medium">{selectedContact.company_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Người liên hệ:</span>
                  <p className="font-medium">
                    {selectedContact.contact_person || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Điện thoại:</span>
                  <p className="font-medium">
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="text-primary hover:underline"
                    >
                      {selectedContact.phone}
                    </a>
                  </p>
                </div>
                {selectedContact.address && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Địa chỉ:</span>
                    <p className="font-medium">{selectedContact.address}</p>
                  </div>
                )}
              </div>

              <div>
                <span className="text-muted-foreground text-sm">Nội dung:</span>
                <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>

              <div className="flex items-center gap-2 border-t pt-2">
                <span className="text-muted-foreground mr-2 text-sm">
                  Đánh dấu:
                </span>
                {Object.entries(statusLabels).map(([key, val]) => (
                  <Button
                    key={key}
                    variant={
                      selectedContact.status === key ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => updateStatus(selectedContact, key)}
                    disabled={statusMutation.isPending}
                  >
                    {val.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title={deleteTarget?.company_name}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
