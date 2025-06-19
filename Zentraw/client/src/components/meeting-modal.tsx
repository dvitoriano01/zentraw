import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { X, Download, FileText, CheckSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type Meeting, type ActionItem } from "@shared/schema";

interface MeetingModalProps {
  meetingId: number;
  onClose: () => void;
}

export function MeetingModal({ meetingId, onClose }: MeetingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: meeting, isLoading: meetingLoading } = useQuery({
    queryKey: ["/api/meetings", meetingId],
    queryFn: async () => {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch meeting');
      return response.json();
    },
  });

  const { data: actionItems = [], isLoading: actionItemsLoading } = useQuery({
    queryKey: ["/api/meetings", meetingId, "action-items"],
    queryFn: async () => {
      const response = await fetch(`/api/meetings/${meetingId}/action-items`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch action items');
      return response.json();
    },
  });

  const updateActionItemMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      return apiRequest('PATCH', `/api/action-items/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetings", meetingId, "action-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/action-items/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleActionItemToggle = (actionItemId: number, completed: boolean) => {
    updateActionItemMutation.mutate({ id: actionItemId, completed });
  };

  const handleExport = () => {
    if (!meeting) return;

    const content = `
MEETING: ${meeting.title}
DATE: ${new Date(meeting.createdAt).toLocaleDateString()}
DURATION: ${meeting.duration ? Math.round(meeting.duration / 60) : 'Unknown'} minutes
TAGS: ${meeting.tags?.join(', ') || 'None'}

TRANSCRIPT:
${meeting.transcript || 'No transcript available'}

ACTION ITEMS:
${actionItems.map((item: ActionItem, index: number) => 
  `${index + 1}. ${item.completed ? '[✓]' : '[ ]'} ${item.text}`
).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Meeting notes have been downloaded",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown duration";
    const minutes = Math.round(seconds / 60);
    return `${minutes} minutes`;
  };

  // Highlight action items in transcript
  const highlightTranscript = (transcript: string, actionItems: ActionItem[]) => {
    let highlighted = transcript;
    
    actionItems.forEach((item) => {
      // Simple highlighting - in a real app, you'd want more sophisticated matching
      const itemWords = item.text.toLowerCase().split(' ').filter(word => word.length > 3);
      itemWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        highlighted = highlighted.replace(regex, `<mark class="bg-yellow-100 px-1 rounded">$&</mark>`);
      });
    });
    
    return highlighted;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex-1">
            {meetingLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {meeting?.title}
                </DialogTitle>
                <p className="text-gray-500">
                  {meeting && `${formatDate(meeting.createdAt)} • ${formatDuration(meeting.duration)}`}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!meeting}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-[60vh] gap-6">
          {/* Transcript Section */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Transcript
            </h3>
            
            {meetingLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            ) : meeting?.transcript ? (
              <div 
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightTranscript(meeting.transcript, actionItems)
                }}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Transcript is being processed...</p>
                <p className="text-sm">This may take a few minutes.</p>
              </div>
            )}
          </div>

          {/* Action Items Section */}
          <div className="w-80 bg-gray-50 rounded-lg p-6 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Action Items
              {!actionItemsLoading && (
                <Badge variant="secondary" className="ml-auto">
                  {actionItems.length}
                </Badge>
              )}
            </h3>
            
            <div className="space-y-3">
              {actionItemsLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-gray-200">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))
              ) : actionItems.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No action items detected</p>
                  <p className="text-sm">AI analysis didn't find any actionable tasks.</p>
                </div>
              ) : (
                actionItems.map((item: ActionItem) => (
                  <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={(checked) => 
                          handleActionItemToggle(item.id, checked as boolean)
                        }
                        disabled={updateActionItemMutation.isPending}
                        className="mt-1"
                      />
                      <p className={`text-sm flex-1 ${
                        item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {item.text}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-6">
                      Extracted {new Date(item.extractedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
