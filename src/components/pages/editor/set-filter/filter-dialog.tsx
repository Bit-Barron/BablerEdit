"use client"

import React from "react"
import { useEditorStore } from "@/lib/store/editor.store"
import { Dialog } from "@/components/ui/retroui/dialog"
import { Button } from "@/components/ui/retroui/button"
import { Input } from "@/components/ui/retroui/input"
import { Label } from "@/components/ui/retroui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useConfigureLang } from "@/hooks/use-configure-lang"

export const FilterDialog: React.FC = () => {
  const {
    setFilterDialogOpen,
    filterDialogOpen,
    setTranslationId,
    translationId,
    setTranslationText,
    translationText,
    translationTextStatus,
    setTranslationTextStatus,
    approvalStateStatus,
    setApprovalStateStatus,
    usageStatus,
    setUsageStatus,
  } = useEditorStore()
  const { handleFilter, handleReset } = useConfigureLang()

  return (
    <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
      <Dialog.Content className="max-w-2xl">
        <Dialog.Header className="px-6 pt-6 pb-4 bg-primary text-primary-foreground rounded-t-lg">
          Set Filter
        </Dialog.Header>

        <div className="space-y-6 px-2 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Substring Search</h3>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3 items-center">
                <Label htmlFor="translation-id" className="text-right">
                  Translation ID:
                </Label>
                <Input
                  value={translationId}
                  onChange={(event) => setTranslationId(event.target.value)}
                  id="translation-id"
                  placeholder=""
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 gap-3 items-center">
                <Label htmlFor="translation-text" className="text-right">
                  Translation text:
                </Label>
                <Input
                  value={translationText}
                  onChange={(e) => setTranslationText(e.target.value)}
                  id="translation-text"
                  placeholder=""
                  className="col-span-3"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Status</h3>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3 items-center">
                <Label htmlFor="translation-text-status" className="text-right">
                  Translation text:
                </Label>
                <Select
                  value={translationTextStatus}
                  onValueChange={(value) => {
                    setTranslationTextStatus(value as string)
                  }}
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue>{translationTextStatus}</SelectValue>
                  </SelectTrigger>
                  <SelectContent sideOffset={4}>
                    <SelectItem value="any">any</SelectItem>
                    <SelectItem value="translated">translated</SelectItem>
                    <SelectItem value="untranslated">untranslated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 gap-3 items-center">
                <Label htmlFor="approval-state" className="text-right">
                  Approval state:
                </Label>
                <Select
                  value={approvalStateStatus}
                  onValueChange={(value) => {
                    setApprovalStateStatus(value as string)
                  }}
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue>{approvalStateStatus}</SelectValue>
                  </SelectTrigger>
                  <SelectContent sideOffset={4}>
                    <SelectItem value="any">any</SelectItem>
                    <SelectItem value="approved">approved</SelectItem>
                    <SelectItem value="not-approved">not approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 gap-3 items-center">
                <Label htmlFor="usage" className="text-right">
                  Usage:
                </Label>
                <Select
                  value={usageStatus}
                  onValueChange={(value) => {
                    setUsageStatus(value as string)
                  }}
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue>{usageStatus}</SelectValue>
                  </SelectTrigger>
                  <SelectContent sideOffset={4}>
                    <SelectItem value="any">any</SelectItem>
                    <SelectItem value="used">used</SelectItem>
                    <SelectItem value="unused">unused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Dialog.Footer>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleFilter()
                setFilterDialogOpen(false)
              }}
            >
              Filter
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
