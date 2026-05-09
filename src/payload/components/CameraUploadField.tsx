'use client'

import React, { useRef } from 'react'
import { Camera, Video } from 'lucide-react'

export default function CameraUploadField() {
  const hiddenImageInputRef = useRef<HTMLInputElement>(null)
  const hiddenVideoInputRef = useRef<HTMLInputElement>(null)

  const handleCaptureImageClick = () => {
    hiddenImageInputRef.current?.click()
  }

  const handleCaptureVideoClick = () => {
    hiddenVideoInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Find the hidden file input used by Payload's Dropzone
    const allFileInputs = Array.from(document.querySelectorAll('input[type="file"]'))
    const targetDropzoneInput = allFileInputs.find(
      (input) => input !== hiddenImageInputRef.current && input !== hiddenVideoInputRef.current,
    ) as HTMLInputElement | undefined

    if (targetDropzoneInput) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      targetDropzoneInput.files = dataTransfer.files
      const event = new Event('change', { bubbles: true })
      targetDropzoneInput.dispatchEvent(event)
    } else {
      alert('File input Payload tidak ditemukan. Pastikan Anda berada di halaman upload.')
    }
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={hiddenImageInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        accept="video/*"
        capture="environment"
        ref={hiddenVideoInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleCaptureImageClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'var(--theme-success-500)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          <Camera size={20} />
          Ambil Foto
        </button>

        <button
          type="button"
          onClick={handleCaptureVideoClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: 'var(--theme-success-500)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          <Video size={20} />
          Rekam Video
        </button>
      </div>

      <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--theme-text-light)' }}>
        Gunakan tombol di atas di perangkat mobile untuk membedakan antara merekam video atau
        mengambil foto.
      </p>
    </div>
  )
}
