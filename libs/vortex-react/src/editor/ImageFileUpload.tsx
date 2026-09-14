// libs/vortex-react/src/editor/ImageFileUpload.tsx
// Ark UI FileUpload dropzone used by ImageInput. Selection and upload are separate so the parent
// can keep Cancel/Upload actions together and show progress from its injected upload seam.
import {
  FileUploadRoot,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadHiddenInput,
  FileUploadItemGroup,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemPreviewImage,
  FileUploadItemName,
  FileUploadItemSizeText,
  FileUploadItemDeleteTrigger,
  type FileUploadFileChangeDetails,
} from '@ark-ui/react/file-upload';
import { ImagePlus, Trash2, Upload } from 'lucide-react';

export interface ImageFileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export function ImageFileUpload({ file, onFileChange, disabled = false }: ImageFileUploadProps) {
  return (
    <FileUploadRoot
      accept="image/*"
      maxFiles={1}
      acceptedFiles={file ? [file] : []}
      disabled={disabled}
      onFileChange={(details: FileUploadFileChangeDetails) => onFileChange(details.acceptedFiles[0] ?? null)}
    >
      <FileUploadDropzone className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-4 py-5 text-center transition-colors data-[dragging]:border-primary data-[dragging]:bg-primary/5">
        <ImagePlus className="size-6 text-muted-foreground" aria-hidden="true" />
        <div className="text-sm font-medium">Drop an image here</div>
        <div className="text-xs text-muted-foreground">or</div>
        <FileUploadTrigger className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent">
          <Upload className="size-4" aria-hidden="true" />
          Choose image
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadItemGroup className="mt-2">
        {file ? (
          <FileUploadItem
            file={file}
            className="flex items-center gap-3 rounded-md border border-border bg-background p-2"
          >
            <FileUploadItemPreview type="image/*" className="size-12 shrink-0 overflow-hidden rounded">
              <FileUploadItemPreviewImage className="size-full object-cover" />
            </FileUploadItemPreview>
            <div className="min-w-0 flex-1">
              <FileUploadItemName className="truncate text-sm font-medium" />
              <FileUploadItemSizeText className="text-xs text-muted-foreground" />
            </div>
            <FileUploadItemDeleteTrigger
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Remove image"
            >
              <Trash2 className="size-4" />
            </FileUploadItemDeleteTrigger>
          </FileUploadItem>
        ) : null}
      </FileUploadItemGroup>
      <FileUploadHiddenInput />
    </FileUploadRoot>
  );
}
