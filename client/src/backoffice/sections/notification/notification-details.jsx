import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const NotificationDetailsPopup = ({ notification, open, onClose }) => {
  const { t } = useTranslation();

  const decodeHtmlEntities = (text) => {
    if (!text) return "";
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const decodedBody = decodeHtmlEntities(notification?.body);
  const sanitizedBody = DOMPurify.sanitize(decodedBody);
  const cleanedBody = sanitizedBody.replace(/<\/?(html|body)[^>]*>/g, "");

  const notificationSentType = notification?.sendType;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight">
              {t("Notification Details")}
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] p-8 pt-4">
          <div className="space-y-8">
            {/* Subject and Content */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {t(notification?.subject)}
              </h3>

              <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div
                  className="prose prose-sm max-w-none text-gray-600 leading-relaxed min-h-[100px]"
                  dangerouslySetInnerHTML={{ __html: cleanedBody }}
                />
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Meta Information Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Type */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  {t("Type")}
                </span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      notificationSentType === "email" ? "info" : "warning"
                    }
                    className="px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider"
                  >
                    {t(notificationSentType)}
                  </Badge>
                </div>
              </div>

              {/* Date Sent */}
              <div className="space-y-2 text-right sm:text-left">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  {t("Date Sent")}
                </span>
                <p className="text-sm font-bold text-gray-700">
                  {new Date(notification?.dateSent).toLocaleString()}
                </p>
              </div>

              {/* Recipients */}
              <div className="sm:col-span-2 space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  {t("Recipients")}
                </span>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                  {notificationSentType === "email" ? (
                    notification?.recipients.map((recipient, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2.5 py-1 rounded-lg font-medium text-[11px] bg-white text-gray-600 border-gray-100 shadow-sm"
                      >
                        {recipient}
                      </Badge>
                    ))
                  ) : (
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 rounded-lg font-bold text-xs bg-amber-50 text-amber-600 border-amber-100"
                    >
                      {t("All Android Users")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 bg-gray-50 border-t flex justify-end">
          <Button
            onClick={onClose}
            className="rounded-2xl bg-primary text-white font-bold px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
          >
            {t("Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDetailsPopup;
