import React, { useState } from 'react';
import {
  Folder,
  Upload,
  Search,
  Grid,
  List,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  MoreVertical,
  Star,
  Download,
  Trash2,
  HardDrive,
  Check,
  X,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { FileItem } from '../types';
import { UserAvatar } from '../components/common/UserAvatar';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const FilesPage: React.FC = () => {
  const {
    files,
    uploadFile,
    deleteFile,
    openCreateModal,
  } = useWorkspace();

  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  const toggleStarFile = (id: string) => {
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const folders = [
    'All',
    'Event Planning',
    'Marketing',
    'Sponsorship',
    'Meeting Materials',
    'Club Policies',
    'Design Assets',
  ];

  const filteredFiles = files.filter((f) => {
    const matchesFolder = selectedFolder === 'All' || f.folder === selectedFolder;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getFileIcon = (ext: string, type: string) => {
    const e = ext.toLowerCase();
    if (e === 'pdf') return <FileText className="w-8 h-8 text-rose-500" />;
    if (e === 'xlsx' || e === 'csv') return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
    if (e === 'docx' || e === 'doc') return <FileText className="w-8 h-8 text-blue-500" />;
    if (e === 'zip') return <FileArchive className="w-8 h-8 text-amber-500" />;
    if (e === 'png' || e === 'jpg' || e === 'svg') return <ImageIcon className="w-8 h-8 text-indigo-500" />;
    return <FileCode className="w-8 h-8 text-slate-500" />;
  };

  const handleSimulatedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    uploadFile({
      name: 'Simulated_Dropped_Asset.pdf',
      folder: selectedFolder === 'All' ? 'Event Planning' : selectedFolder,
      size: '2.4 MB',
      extension: 'pdf',
      type: 'pdf',
    });
  };

  return (
    <div id="files-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">File Repository</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {files.length} documents
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized document vault with version tracking and categorized team folders.
          </p>
        </div>

        {/* Action Controls & Storage Gauge */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Storage Meter */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <HardDrive className="w-4 h-4 text-indigo-500" />
            <div>
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500">
                <span>Storage</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">4.2 GB / 10 GB</span>
              </div>
              <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden mt-0.5">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>
          </div>

          <button
            id="btn-upload-file-modal"
            onClick={() => openCreateModal('file')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Folder Tabs bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {folders.map((folder) => {
          const isSelected = selectedFolder === folder;
          const count = folder === 'All' ? files.length : files.filter((f) => f.folder === folder).length;
          return (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              <span>{folder}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-indigo-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and View toggler - fully responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#0a0b16]/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 flex-1 min-w-0 w-full sm:w-auto">
          <Search className="w-4 h-4 text-indigo-400 shrink-0" />
          <input
            type="text"
            placeholder="Search documents by filename or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent border-none outline-none text-white placeholder:text-indigo-300/40 min-w-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-indigo-400 hover:text-white p-1 shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-1 p-0.5 bg-white/5 border border-white/10 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-300/60 hover:text-white'
            }`}
            aria-label="Grid view"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-300/60 hover:text-white'
            }`}
            aria-label="Table view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Drag & Drop simulated upload zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleSimulatedDrop}
        onClick={() => openCreateModal('file')}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700/80 rounded-xl p-6 text-center hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/40"
      >
        <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1.5" />
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          Drop files here to upload into "{selectedFolder === 'All' ? 'Event Planning' : selectedFolder}"
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, DOCX, XLSX, PPTX, PNG, ZIP up to 50MB</p>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                    {getFileIcon(file.extension, file.type)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStarFile(file.id)}
                      className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                      title={starredIds.has(file.id) ? 'Unstar file' : 'Star file'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          starredIds.has(file.id) ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => setFileToDelete(file)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate" title={file.name}>
                  {file.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.extension.toUpperCase()}</span>
                  <span>•</span>
                  <span className="truncate">{file.folder}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <UserAvatar initials={file.uploadedBy.split(' ').map((n) => n[0]).join('')} size="xs" />
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                    {file.uploadedBy}
                  </span>
                </div>
                <a
                  href={`#download-${file.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Simulated download initialized for: ${file.name}`);
                  }}
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Document Name</th>
                <th className="p-3.5">Folder</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Uploader</th>
                <th className="p-3.5">Uploaded Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <button onClick={() => toggleStarFile(file.id)}>
                      <Star
                        className={`w-3.5 h-3.5 ${
                          starredIds.has(file.id) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                    <span className="truncate max-w-xs">{file.name}</span>
                  </td>
                  <td className="p-3.5 text-slate-500">{file.folder}</td>
                  <td className="p-3.5 text-slate-500">{file.size}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500 uppercase">{file.extension}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{file.uploadedBy}</td>
                  <td className="p-3.5 text-slate-400">{file.uploadedDate}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => alert(`Simulated download initialized for: ${file.name}`)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFileToDelete(file)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(fileToDelete)}
        title="Delete File"
        message={`Are you sure you want to delete "${fileToDelete?.name}"? All previous version histories for this file will be permanently removed.`}
        confirmLabel="Delete File"
        isDestructive={true}
        onConfirm={() => {
          if (fileToDelete) {
            deleteFile(fileToDelete.id);
            setFileToDelete(null);
          }
        }}
        onCancel={() => setFileToDelete(null)}
      />
    </div>
  );
};
