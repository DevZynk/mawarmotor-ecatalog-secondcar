import { OptimizationStatus as OptimizationStatus_841f288f491e1fefe208477b779cfd1c } from '@inoo-ch/payload-image-optimizer/client'
import { RegenerationButton as RegenerationButton_841f288f491e1fefe208477b779cfd1c } from '@inoo-ch/payload-image-optimizer/client'
import { UploadOptimizer as UploadOptimizer_841f288f491e1fefe208477b779cfd1c } from '@inoo-ch/payload-image-optimizer/client'
import { OverviewComponent as OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaTitleComponent as MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaDescriptionComponent as MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaImageComponent as MetaImageComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { PreviewComponent as PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { ExportListMenuItem as ExportListMenuItem_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { ImportListMenuItem as ImportListMenuItem_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { default as default_738b8c6022a0f23d62dbe448998b2379 } from '../../../payload/components/CameraUploadField'
import { FormatField as FormatField_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { LimitField as LimitField_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { Page as Page_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { SortBy as SortBy_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { SortOrder as SortOrder_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { SelectionToUseField as SelectionToUseField_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { FieldsToExport as FieldsToExport_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { CollectionField as CollectionField_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { ExportPreview as ExportPreview_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { ExportSaveButton as ExportSaveButton_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { ImportPreview as ImportPreview_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { ImportSaveButton as ImportSaveButton_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { default as default_84a3924fa6975f815fe159e126e4ec9c } from '../../../payload/components/AdminIcon'
import { default as default_564bf34304abb38917a0b375396d43e6 } from '../../../payload/components/AdminLogo'
import { default as default_7c0525bf499ee6ddfb90ddfff60da17e } from '../../../payload/components/LogoutButton'
import { default as default_4538e12026942134a4f829e6f6f521ff } from '../../../payload/components/AnalyticNavLink'
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from '@payloadcms/storage-s3/client'
import { ImportExportProvider as ImportExportProvider_cdf7e044479f899a31f804427d568b36 } from '@payloadcms/plugin-import-export/rsc'
import { default as default_2c11dd5eb9422a3eba162a30c08399e5 } from '../../../payload/components/AnalyticDashboard'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

/** @type import('payload').ImportMap */
export const importMap = {
  "@inoo-ch/payload-image-optimizer/client#OptimizationStatus": OptimizationStatus_841f288f491e1fefe208477b779cfd1c,
  "@inoo-ch/payload-image-optimizer/client#RegenerationButton": RegenerationButton_841f288f491e1fefe208477b779cfd1c,
  "@inoo-ch/payload-image-optimizer/client#UploadOptimizer": UploadOptimizer_841f288f491e1fefe208477b779cfd1c,
  "@payloadcms/plugin-seo/client#OverviewComponent": OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaTitleComponent": MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaDescriptionComponent": MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaImageComponent": MetaImageComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#PreviewComponent": PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-import-export/rsc#ExportListMenuItem": ExportListMenuItem_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#ImportListMenuItem": ImportListMenuItem_cdf7e044479f899a31f804427d568b36,
  "/payload/components/CameraUploadField#default": default_738b8c6022a0f23d62dbe448998b2379,
  "@payloadcms/plugin-import-export/rsc#FormatField": FormatField_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#LimitField": LimitField_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#Page": Page_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#SortBy": SortBy_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#SortOrder": SortOrder_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#SelectionToUseField": SelectionToUseField_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#FieldsToExport": FieldsToExport_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#CollectionField": CollectionField_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#ExportPreview": ExportPreview_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#ExportSaveButton": ExportSaveButton_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#ImportPreview": ImportPreview_cdf7e044479f899a31f804427d568b36,
  "@payloadcms/plugin-import-export/rsc#ImportSaveButton": ImportSaveButton_cdf7e044479f899a31f804427d568b36,
  "/payload/components/AdminIcon#default": default_84a3924fa6975f815fe159e126e4ec9c,
  "/payload/components/AdminLogo#default": default_564bf34304abb38917a0b375396d43e6,
  "/payload/components/LogoutButton#default": default_7c0525bf499ee6ddfb90ddfff60da17e,
  "/payload/components/AnalyticNavLink#default": default_4538e12026942134a4f829e6f6f521ff,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  "@payloadcms/plugin-import-export/rsc#ImportExportProvider": ImportExportProvider_cdf7e044479f899a31f804427d568b36,
  "/payload/components/AnalyticDashboard#default": default_2c11dd5eb9422a3eba162a30c08399e5,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
