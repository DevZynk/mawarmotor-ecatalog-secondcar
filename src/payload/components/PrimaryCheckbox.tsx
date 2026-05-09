'use client'

import React from 'react'
import { useField, useForm, CheckboxInput, FieldLabel } from '@payloadcms/ui'

export default function PrimaryCheckbox({ path, label }: { path: string; label: string }) {
  const { value, setValue } = useField<boolean>({ path })
  const { getData, dispatchFields } = useForm()

  const handleChange = (checked: boolean) => {
    setValue(checked)

    if (checked) {
      // Uncheck others
      const data = getData()
      const gallery = (data as any)?.gallery || []

      gallery.forEach((item: any, index: number) => {
        const itemPath = `gallery.${index}.isPrimary`
        if (itemPath !== path && item.isPrimary) {
          dispatchFields({
            type: 'UPDATE',
            path: itemPath,
            value: false,
          })
        }
      })
    }
  }

  return (
    <div className="field-type checkbox" style={{ marginBottom: '20px' }}>
      <div className="checkbox-input">
        <CheckboxInput
          label={label || 'Foto Utama (Card)'}
          checked={Boolean(value)}
          onToggle={() => handleChange(!value)}
        />
      </div>
    </div>
  )
}
