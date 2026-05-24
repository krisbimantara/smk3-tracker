import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from './lib/supabase';

// ─────────────────────────────────────────────
// DATA: 64 KRITERIA SMK3
// ─────────────────────────────────────────────
const PHASES = [
  {
    id: 1,
    code: "fase-1",
    title: "Fondasi",
    subtitle: "Komitmen, organisasi K3 & kebijakan",
    color: "#534AB7",
    colorLight: "#EEEDFE",
    target: "Bulan 1–2",
    criteria: [
      { id: "1.1.1", interpretasi: `Prosedur penyusunan/penetapan dan tinjauan ulang kebijakan K3. Perusahaan membuat kebijakan K3 secara tertulis, bertanggal, isinya mencakup tujuan dan sasaran K3 serta pernyataan tertulis komitmen perusahaan mengenai pelaksanaan K3 di tempat kerjanya.
Bukti: Tertulis, Tertanggal, Tujuan K3, Sasaran K3, Pernyataan komitmen, Tanda tangan pimpinan.`, title: "Kebijakan K3 tertulis, bertanggal, tujuan & sasaran", docs: [] },
      { id: "1.1.3", interpretasi: `Diseminasi kebijakan K3 (model dan media yang digunakan). Bentuk komunikasi kebijakan dapat melalui: penempelan poster, pembacaan saat briefing pagi, kartu pengenal visitor, lampiran dalam kontrak, materi briefing bagi tamu, papan pengumuman di pintu masuk, pelatihan pengenalan (induction training) dll.
Bukti: Papan pengumuman, Brosur/leaflet, Poster, Spanduk/standing banner, Jaringan komputer, Ceramah/briefing (klasikal/non klasikal), Coffee morning.`, title: "Komunikasi kebijakan K3 ke seluruh TK, tamu, kontraktor", docs: [] },
      { id: "1.2.2", interpretasi: `Dokumen normatif. Ada beberapa penanggung jawab K3 yang sesuai dengan peraturan perundangan yaitu: Sekretaris P2K3/Ahli K3 (Permenaker No.Per.04/MEN/1987 & No.Per.02/MEN/1992), Dokter pemeriksa kesehatan TK (Permenaker No.Per.01/MEN/1976), Paramedis (Permenaker No.Per.01/MEN/1979), Auditor Internal SMK3 (Permenaker No.Per.26/2014), Operator Ketel Uap (Permenaker No.Per.01/MEN/1988), Operator Pesawat Angkat Angkut (Permenaker No.Per.09/MEN/VII/2010), Operator Pes. Tenaga/diesel (Permenaker No.Per.04/MEN/1985), Petugas P3K (Permenakertrans No.Per.15/MEN/VII/2008), Petugas pemadam kebakaran (Kepmenaker No.Kep.186/MEN/1999), Ahli K3 Kimia & Petugas K3 Kimia (Kepmenaker No.Kep.187/MEN/1999), Kualifikasi Juru Las (Permenaker No.Per.02/MEN/1982).
Bukti: Sertifikat/SKP/SIO dari Kemenaker untuk semua jabatan di atas, SPT personil ybs (perseorangan/tim).`, title: "Penunjukan penanggung jawab K3 sesuai peraturan", docs: [] },
      { id: "1.2.4", interpretasi: `Dapat dilihat dalam Visi, Misi dan Program K3 yang ditetapkan oleh pengusaha atau pengurus perusahaan serta dukungan SDM dan anggaran.
Bukti: Visi, Misi, Program K3, Alokasi anggaran. Ref. Dokumen kontrak/RKS.`, title: "Pengusaha bertanggung jawab penuh atas SMK3", docs: [] },
      { id: "1.2.5", interpretasi: `Tim Tanggap Darurat (Emergency Response Team). Dapat dilihat dari sertifikat pelatihan, dokumentasi latihan darurat, absensi latihan. Penetapan petugas dapat diketahui dari tanda pengenal misalnya topi/helm khusus, badge, warna baju, dll. Petugas dilatih sesuai ketentuan: Petugas Pemadam Kebakaran (Kepmenaker No.Kep.186/MEN/1999), Petugas P3K (Permenakertrans No.Per.15/MEN/VII/2008).
Bukti: Sertifikat pelatihan, SPT ybs dari perusahaan, Tanda pengenal/atribut ybs.`, title: "Petugas tanggap darurat ditetapkan & dilatih", docs: [] },
      { id: "1.2.6", interpretasi: `Peran ahli K3 dalam pemberian saran/rekomendasi. Verifikasi peran ahli K3 dalam: Kontrak/format RKS, Checklist verifikasi pembelian barang, Format ijin kerja (working permit), Format pengesahan prosedur/IK.
Dari dalam: laporan auditor internal K3, laporan inspeksi/rekomendasi ahli K3, laporan studi banding/bench marking.
Dari luar: laporan kinerja K3 dari konsultan independen, nota pemeriksaan dari pegawai pengawas Disnaker setempat.`, title: "Perusahaan mendapat saran dari ahli K3 internal/eksternal", docs: [] },
      { id: "1.4.1", interpretasi: `Prosedur Konsultasi, Komunikasi, Informasi K3. Dokumentasi dapat dalam bentuk notulensi kegiatan, jadwal atau time table kegiatan. Wakil perusahaan adalah personil yang ditunjuk oleh manajemen perusahaan.
Bukti: Dokumen kegiatan konsultasi TK dengan wakil perusahaan, Notulen rapat forum Serikat Pekerja, Notulen rapat forum P2K3, Daftar hadir.`, title: "Keterlibatan & penjadwalan konsultasi TK terdokumentasi", docs: [] },
      { id: "1.4.3", interpretasi: `Bukti dapat berupa dokumen surat penunjukan/pengesahan P2K3 dari Disnaker setempat.
Bukti: SK Pengesahan P2K3 dari Disnaker setempat.`, title: "P2K3 dibentuk sesuai peraturan, SK dari Disnaker", docs: [] },
      { id: "1.4.4", interpretasi: `Pejabat Ketua P2K3 adalah pimpinan tertinggi perusahaan. Lihat pada dokumen 1.4.3 siapa yang menjabat sebagai ketua P2K3. Seharusnya pengurus atau pimpinan puncak perusahaan, yang dimaksud pengurus disini sesuai dengan Permenaker No.Per.04/MEN/1987 pasal 3 ayat (1).`, title: "Ketua P2K3 adalah pimpinan puncak / pengurus", docs: [] },
      { id: "1.4.5", interpretasi: `Pejabat Sekretaris P2K3 adalah ahli K3. Sekretaris P2K3 adalah Ahli K3 sesuai dengan Permenaker No.Per.04/MEN/1987 pasal 3 ayat (2).
Bukti: Surat penunjukan ahli K3 dan sertifikat pelatihan (ahli K3 umum) sesuai Permenaker No.Per.02/MEN/1992.`, title: "Sekretaris P2K3 adalah Ahli K3 bersertifikat", docs: [] },
      { id: "1.4.6", interpretasi: `Prioritas kegiatan P2K3. Lihat pada program-program K3 yang direncanakan atau sedang dilaksanakan oleh P2K3, apakah terkait dengan: pengembangan atau peninjauan kebijakan dan prosedur pengendalian risiko terkait temuan dari hasil penilaian risiko (notulen rapat P2K3) sesuai dengan tugas dan fungsi P2K3 yang tercantum dalam Permenaker No.Per.04/MEN/1987.`, title: "P2K3 fokus pada pengembangan kebijakan & prosedur risiko", docs: [] },
      { id: "1.4.7", interpretasi: `Susunan pengurus P2K3. Dapat dilihat dari mekanisme pemberitahuan/pengumuman berkaitan dengan informasi K3 dan jumlah tenaga kerja yang mengetahui kepengurusan P2K3.
Bukti: Model dan jenis media pemberitahuan/pengumuman pengurus P2K3, Sampling jumlah tenaga kerja yang tahu pengurus P2K3.`, title: "Susunan pengurus P2K3 didokumentasikan & diinformasikan", docs: [] },
      { id: "1.4.8", interpretasi: `Rapat P2K3. Pertemuan P2K3 minimal dilakukan 1 kali dalam sebulan atau sesuai ketentuan dalam prosedur mengenai P2K3.
Bukti: Jadwal rapat P2K3, Notulen, Daftar hadir, Rekomendasi hasil rapat, Penyebarluasan kegiatan P2K3.`, title: "P2K3 rapat teratur (min. 1x/bulan), hasil disebarluaskan", docs: [] },
      { id: "1.4.9", interpretasi: `Laporan rutin P2K3. Sesuai Permenaker No.Per.04/MEN/1987 tiap 3 bulan sekali kegiatan P2K3 harus dilaporkan ke Disnaker setempat menggunakan format pelaporan yang disediakan sesuai peraturan.
Bukti: Laporan kegiatan setiap bulan setelah rapat bulanan P2K3, Laporan triwulan kepada Disnaker setempat, Tanda terima dari Disnaker setempat.`, title: "P2K3 melaporkan kegiatan ke Disnaker tiap triwulan", docs: [] },
    ],
  },
  {
    id: 2,
    code: "fase-2",
    title: "Perencanaan",
    subtitle: "Manajemen risiko, dokumentasi & prosedur",
    color: "#0F6E56",
    colorLight: "#E1F5EE",
    target: "Bulan 2–4",
    criteria: [
      { id: "2.1.1", interpretasi: `Prosedur Risk Management (HIRARC). Terdapat rencana atau program kegiatan untuk mengendalikan risiko yang diidentifikasi. Bentuk dokumen dapat berupa program/rencana K3 atau manajemen program. Untuk penerapannya dapat dilihat dari pemantauan/monitoring program kerja yang berkaitan dengan pengendalian risiko tsb.
Bukti: Checklist HIRARC (Hazard Identification, Hazard Evaluation, Hazard Control), Laporan hasil MONEV, Program kegiatan pengendalian risiko.`, title: "Prosedur HIRARC: identifikasi bahaya, penilaian & pengendalian risiko", docs: [] },
      { id: "2.4.1", interpretasi: `Penyebaran informasi dan kegiatan K3. Bentuknya dapat berupa (tulisan, lisan, tanda) papan pengumuman, foto-foto, poster, label, verbal dalam rapat, briefing/apel, email, dll. Tata caranya dapat dilihat dari prosedur komunikasi. Ada bagian/personil yang ditunjuk sebagai penanggung jawab.
Bukti: Model dan media komunikasi, Penyebaran informasi kegiatan K3 (verbal/email/papan pengumuman), Jenis kegiatan dan informasi K3 yang disebarkan (foto, label, tanda-tanda, poster, dll), Bagian/personil yang ditunjuk sebagai penanggung jawab.`, title: "Informasi K3 disebarluaskan sistimatis ke seluruh pihak", docs: [] },
      { id: "3.1.1", interpretasi: `Prosedur perancangan dan modifikasi. Terdapat dokumentasi tertulis berupa prosedur perancangan dan modifikasi yang di dalamnya terdapat identifikasi bahaya dan penilaian risiko (manajemen risiko). Lihat detail isi prosedurnya, bagaimana tahapan manajemen risiko tsb dimasukkan pada tahap perancangan.
Bukti: HIRARC pada tahap prosedur perancangan dan modifikasi.`, title: "HIRARC terintegrasi dalam prosedur perancangan & modifikasi", docs: [] },
      { id: "3.2.2", interpretasi: `Petugas yang berkompeten sesuai peraturan perundangan. Ada petugas yang ditunjuk bertanggung jawab dan memiliki kualifikasi sesuai peraturan perundangan. Persyaratan personil yang melakukan kegiatan tsb tercakup dan diatur dalam prosedur tsb (minimal telah mendapat pelatihan ahli K3 dan manajemen risiko serta yang berpengalaman di bidangnya).
Bukti: Petugas yang ditunjuk bertanggung jawab dan memiliki kualifikasi sesuai peraturan perundangan (Ahli K3), Persyaratan personil tercakup dalam prosedur kontrak, Minimal telah mendapat pelatihan manajemen risiko yang diutamakan berpengalaman di bidangnya.`, title: "Identifikasi bahaya pada tinjauan kontrak oleh petugas kompeten", docs: [] },
      { id: "4.1.1", interpretasi: `Prosedur pengendalian dokumen. Dapat dilihat dari acuan prosedur pengendalian dokumen yang telah ditetapkan, dimana status dokumen dapat berupa tata cara penomoran (kodefikasi dokumen), wewenang dapat berupa siapa personil yang dapat menyetujui dokumen, terdapat tanggal pengeluaran dan modifikasi dokumen bila terjadi perubahan.
Bukti: Acuan prosedur pengendalian dokumen, Status dokumen/kodefikasi, Personil yang berwenang menyetujui dokumen, Tanggal pengeluaran, Catatan modifikasi dokumen bila terjadi perubahan.`, title: "Dokumen K3 memiliki identifikasi status, wewenang & tanggal", docs: [] },
      { id: "5.1.1", interpretasi: `Prosedur pembelian. Adanya prosedur tertulis mengenai pembelian barang atau jasa dimana spesifikasi K3 dan informasi lain yang terkait dicantumkan dalam salah satu klausul prosedur tsb secara jelas, misalkan adanya MSDS untuk pembelian bahan kimia, informasi yang relevan untuk pembelian APD, dll.
Bukti: Prosedur tertulis mengenai pembelian barang atau jasa, Spesifikasi K3 dan informasi lain yang terkait dicantumkan secara jelas (MSDS untuk pembelian bahan kimia, informasi relevan untuk pembelian APD, dll).`, title: "Prosedur pembelian memuat spesifikasi K3 (MSDS, APD, dll.)", docs: [] },
      { id: "5.1.2", interpretasi: `Kriteria ini merupakan aplikasi dari kriteria 5.1.1 sesuai persyaratan peraturan dan standar K3. Perusahaan dapat menunjukkan contoh catatan purchase order yang memasukkan item K3 saat pembeliannya secara jelas.
Bukti: Spesifikasi pembelian untuk setiap sarana produksi, zat kimia atau jasa sesuai dengan persyaratan peraturan dan standar K3.`, title: "Spesifikasi pembelian sarana produksi sesuai standar K3", docs: [] },
      { id: "5.2.1", interpretasi: `RKS pembelian (Ref. 5.1.1). Dilakukan pemeriksaan terhadap barang dan jasa kesesuaiannya dengan spesifikasi pembelian yang telah ditetapkan dalam 5.1.1.
Bukti: Spek pembelian (checklist).`, title: "Barang & jasa yang dibeli diperiksa sesuai spesifikasi", docs: [] },
    ],
  },
  {
    id: 3,
    code: "fase-3",
    title: "Operasional",
    subtitle: "Pengendalian kerja, APD, darurat & fasilitas",
    color: "#185FA5",
    colorLight: "#E6F1FB",
    target: "Bulan 3–6",
    criteria: [
      { id: "6.1.1", interpretasi: `Petugas manajemen risiko yang berkompeten (Ref. 2.1.2). Perusahaan telah menunjuk personil untuk melakukan manajemen risiko. Bukti penerapannya dapat dilihat dari catatan manajemen risiko untuk setiap tahapan proses kerja. Kompetensi petugas dapat dilihat dari sertifikat atau catatan pelatihan manajemen risiko, job desc atau wewenangnya, atau dari track record pengalaman serta catatan manajemen risiko sesuai dengan tata cara perhitungan yang telah ditetapkan.
Bukti: Penunjukan personil untuk manajemen risiko, Catatan manajemen risiko untuk setiap tahapan proses kerja, Sertifikat/catatan pelatihan manajemen risiko, job desc/wewenang, track record pengalaman.`, title: "Petugas kompeten mengidentifikasi bahaya & menilai risiko proses kerja", docs: [] },
      { id: "6.1.5", interpretasi: `Sistem ijin kerja. Bila ada pengembangan dan atau perubahan terhadap prosedur kerja/instruksi kerja maka harus mengacu kepada ketentuan peraturan perundangan, standar atau ketentuan lainnya yang terkait. Pada prosedur kerja/instruksi kerja dapat dilihat siapa personil yang membuat, mereview dan menyetujui pada halaman terdepan. Prasyarat pemenuhan kompetensi petugas dapat dilihat dalam prosedur pengendalian dokumen yang mengatur pembuatan dan persetujuan dokumen.
Bukti: Prosedur kerja/instruksi kerja yang mengacu peraturan perundangan, Kolom referensi standar/peraturan, Kolom pembuat/reviewer/approver, Notulensi rapat perubahan prosedur.`, title: "Sistem ijin kerja (work permit) untuk tugas berisiko tinggi", docs: [] },
      { id: "6.1.6", interpretasi: `Manajemen APD. Pemeliharaan/penyimpanan dan penggunaan APD dilakukan secara benar sesuai dengan spesifikasi dan petunjuk pabrik pembuat atau standar teknis yang berlaku secara universal.
Ref: Permenakertrans No.PER.08/2010 tentang APD, Inst. Menaker No.Inst.02/M/BW/1984 tentang Pengesahan APD, SE Dirjen BINAWAS No.SE.05/BW/1997 tentang Pendaftaran APD.
Bukti: Catatan pemeliharaan/penyimpanan APD, Catatan penggunaan APD, Spesifikasi dan petunjuk pabrik pembuat atau standar teknis yang digunakan.`, title: "APD disediakan, digunakan benar & dipelihara layak pakai", docs: [] },
      { id: "6.1.7", interpretasi: `APD layak pakai. Kesesuaian APD dengan standar/peraturan perundangan yang berlaku dapat dilihat pada spesifikasi teknisnya yang berasal dari pihak supplier yang tercantum dalam informasi brosur maupun sertifikat uji kelayakan dari pihak yang berwenang yang terlampir (sertifikasi produk). Uji kelayakan dapat mengacu kepada beberapa standar yang berlaku secara universal misal SNI, BS, ISO, dll.
Bukti: Spesifikasi teknis dari supplier, Sertifikat uji kelayakan dari pihak yang berwenang, Kesesuaian APD dengan spesifikasi teknis, Sertifikasi produk terlampir.`, title: "APD dinyatakan layak pakai sesuai standar & peraturan", docs: [] },
      { id: "6.2.1", interpretasi: `Prosedur dan petunjuk kerja yang telah ditentukan dalam pengawasan. Ada kegiatan pengawasan terhadap pelaksanaan pekerjaan di tempat kerja. Biasanya menjadi tanggung jawab supervisor atau yang setingkat. Lihat pada uraian tanggung jawabnya.
Bukti: Prosedur dan petunjuk kerja yang telah ditentukan, Kegiatan pengawasan terhadap pelaksanaan pekerjaan di tempat kerja, Tanggung jawab supervisor atau yang setingkat integral dengan pelaksanaan K3, Bukti dokumen berupa checklist, catatan pekerjaan/log book inspeksi harian, dsb.`, title: "Pengawasan pekerjaan: checklist & log book inspeksi harian", docs: [] },
      { id: "6.3.1", interpretasi: `Prosedur Penempatan Personil. Persyaratan tugas tertentu termasuk persyaratan kesehatan diidentifikasi. Perusahaan menetapkan syarat kesehatan dalam penerimaan pekerja. Lihat pada prosedur penerimaan pekerja dan data-data aktifitas pemeriksaan kesehatan tenaga kerja selama ini.
Bukti: Ref. prosedur umum penerimaan pegawai/pekerja, Daftar pekerjaan/tugas tertentu yang termasuk dalam kategori potensi bahaya tinggi, Persyaratan kesehatan terkait dengan tugas tertentu telah ditetapkan.`, title: "Persyaratan tugas & kesehatan untuk seleksi & penempatan TK", docs: [] },
      { id: "6.3.2", interpretasi: `Penugasan pekerjaan harus berdasarkan pada kemampuan. Sama dengan 6.3.1 dan terdapat job qualification untuk setiap jabatan yang mencakup minimal pelatihan dan latar belakang pendidikan serta pengalaman.
Bukti: Job qualification untuk setiap jabatan, Persyaratan pelatihan minimal dan latar belakang pendidikan serta pengalaman, Bukti dokumen level III dan level IV untuk implementasinya.`, title: "Penugasan berdasarkan kemampuan, keterampilan & kewenangan", docs: [] },
      { id: "6.4.1", interpretasi: `Daerah-daerah yang memerlukan pembatasan ijin masuk. Adanya dokumen atau daftar daerah-daerah di tempat kerja yang memerlukan ijin masuk. Dapat juga dicek langsung ke lapangan atau dilihat dari catatan manajemen risiko yang telah dilakukan.
Bukti: Dokumen atau daftar daerah-daerah di tempat kerja yang memerlukan ijin masuk berdasarkan dokumen manajemen risiko, Dapat dicek langsung ke lapangan (dokumen level IV) atau dilihat dari catatan manajemen risiko yang telah dilakukan.`, title: "Penilaian risiko untuk area pembatasan ijin masuk", docs: [] },
      { id: "6.4.2", interpretasi: `Pembatasan ijin masuk. Pada daerah-daerah tsb dilakukan pengendalian yang dapat berupa ijin tertulis, penguncian, rambu-rambu, dll.
Bukti: Pembatasan ijin masuk pada daerah-daerah tsb dilakukan berupa ijin tertulis, penguncian, rambu-rambu, dsb.`, title: "Pengendalian area terbatas: ijin tertulis, penguncian, rambu", docs: [] },
      { id: "6.4.3", interpretasi: `Tersedianya fasilitas dan layanan. Fasilitas yaitu kamar mandi, wastafel, shower, loker/ruangan ganti, mushola, ruang makan, kantin, sarana olah raga, poliklinik, alat bantu kerja seperti tangga, lantai ruang, transportasi, dll. Layanan yaitu penyediaan air minum bersih, layanan makan, layanan kesehatan, dll.
Verifikasi kelengkapan fasilitas dan layanan yang tersedia di tempat kerja sesuai standar dan pedoman teknis.`, title: "Fasilitas & layanan (toilet, loker, poliklinik, air minum, dll.)", docs: [] },
      { id: "6.4.4", interpretasi: `Pemasangan rambu-rambu K3. Rambu K3 (safety sign, warning sign, poster, rambu APD, rambu APAR, rambu parkir, dll) dan pintu darurat dipasang sesuai standar berdasarkan pedoman teknis yang berlaku, mempunyai sinyal penerangan minimal 10 lux dan berwarna hijau serta tulisan putih dan mempunyai tanda bertuliskan 'keluar' atau 'exit' di atasnya dan menghadap ke koridor.
Bukti: Rambu K3 (safety sign, warning sign, poster, rambu APD, rambu APAR, rambu parkir, dll), Pintu darurat sesuai standar, Sinyal penerangan minimal 10 lux, Berwarna hijau dengan tulisan putih, Tanda 'keluar'/'exit' menghadap ke koridor.`, title: "Rambu K3 terpasang sesuai standar (safety sign, EXIT, APAR)", docs: [] },
      { id: "6.5.2", interpretasi: `Catatan yang memuat data secara rinci dari kegiatan pemeriksaan, pemeliharaan, perbaikan dan perubahan. Perusahaan menyimpan catatan-catatan pemeliharaan yang dilakukan, berbentuk daftar riwayat pemeriksaan alat baik dalam bentuk soft copy atau hard copy.
Bukti: Daftar sarana dan peralatan produksi, Daftar riwayat pemeriksaan alat dalam bentuk soft copy atau hard copy.`, title: "Catatan pemeriksaan, pemeliharaan & perbaikan sarana produksi", docs: [] },
      { id: "6.5.3", interpretasi: `Sertifikat/pengesahan/ijin. Perusahaan memiliki sertifikat (ijin/pengesahan pemakaian) sarana produksi yang masih berlaku. Sarana produksi yang dimaksud antara lain: bejana tekanan (Permenaker No.Per.01/MEN/1982), pesawat angkat dan angkut (Permenaker No.Per.05/MEN/1985), pesawat tenaga dan produksi (Permenaker No.Per.04/MEN/1985), pesawat uap (UU dan Peraturan Uap 1930).
Bukti: Sertifikat/ijin/pengesahan pemakaian sarana produksi yang masih berlaku, Daftar sarana produksi, Jadwal monitoring terhadap peralatan dalam obyek pengawasan, Jadwal kedaluwarsa sertifikat beserta jadwal resertifikasi peralatan.`, title: "Sarana produksi bersertifikat masih berlaku (ketel uap, pesawat angkat)", docs: [] },
      { id: "6.5.4", interpretasi: `Petugas yang berkompeten dan berwenang. Lihat kompetensi personil yang melakukan kegiatan perawatan sarana produksi tsb (sertifikat, lisensi, pengalaman). Jika dilakukan oleh pihak ke-3 dapat menunjukkan CV beserta sertifikat pelaksana berdasarkan proposal yang dikirimkan, kemudian dibandingkan dengan laporan/berita acara penyelesaian pekerjaan apakah sama.
Bukti: Sertifikat, lisensi, pengalaman personil, Jika pihak ke-3: sertifikat ahli K3 dan lisensi (SKP) ybs, Verifikasi laporan/berita acara penyelesaian pekerjaan dengan proposal yang diajukan.`, title: "Pemeliharaan & perbaikan oleh petugas kompeten & berwenang", docs: [] },
      { id: "6.5.7", interpretasi: `Terdapat sistem untuk penandaan (LOTO). Penandaan pada mesin/sarana produksi yang sedang diperbaiki atau rusak ini dapat dituangkan dalam prosedur pemeliharaan yang mencakup lock-out dan tag-out (LOTO) atau prosedur lock-out dan tag-out (LOTO) bila terpisah. Lihat rekaman penandaan yang ada dibandingkan dengan prosedurnya.
Bukti: Penandaan pada mesin/sarana produksi yang sedang diperbaiki atau rusak, Rekaman penandaan yang ada dibandingkan dengan prosedurnya, Pelaksanaan di lapangan/tempat kerja.`, title: "Sistem penandaan (tag-out / LOTO) peralatan tidak aman", docs: [] },
      { id: "6.5.8", interpretasi: `Sistem penguncian pengoperasian (lock out sistem). Terdapat mekanisme penguncian (lihat bentuk/sistem penguncian yang digunakan) terkait dengan prosedur pemeliharaan/perbaikan atau prosedur lock-out dan tag-out (LOTO) bila terpisah. Rekamannya dapat dilihat pada daftar pelaksanaan lock-out dan dibandingkan dengan prosedurnya.
Bukti: Mekanisme penguncian terkait prosedur pemeliharaan/perbaikan, Prosedur lock-out dan tag-out (LOTO), Rekaman daftar pelaksanaan lock-out dibandingkan dengan prosedur.`, title: "Sistem penguncian (lock-out) untuk mencegah pengoperasian prematur", docs: [] },
      { id: "6.5.9", interpretasi: `Prosedur pengamanan area. Terdapat prosedur yang dapat menjamin pengamanan area yang saat proses pemeriksaan, pemeliharaan, perbaikan dan perubahan dilakukan.
Bukti: Prosedur yang dapat menjamin pengamanan area saat proses pemeriksaan, pemeliharaan, perbaikan dan perubahan, Dokumen dalam bentuk formulir/checklist yang digunakan.`, title: "Prosedur pengamanan area saat pemeliharaan & perbaikan", docs: [] },
      { id: "6.7.4", interpretasi: `Petugas penanganan keadaan darurat (ER). Khusus petugas darurat telah diberi pelatihan spesifik darurat sesuai dengan peran dan tugasnya (damkar/P3K). Rekaman dapat berupa daftar hadir dan atau sertifikat pelatihan serta catatan pelatihan terkait. Untuk tim kebakaran dapat mengacu pada Kepmenaker No.Kep.186/MEN/1999.
Bukti: Petugas darurat telah ditetapkan, Pelatihan spesifik sesuai peran dan tugasnya (damkar, P3K, evakuasi), Sertifikat pelatihan, Rekaman daftar hadir dan catatan pelatihan. Ref: Kepmenaker No.Kep.187/MEN/1999, Permenakertrans No.Per.15/VII/2008.`, title: "Petugas darurat ditetapkan, dilatih & diinformasikan ke TK", docs: [] },
      { id: "6.7.6", interpretasi: `Peralatan dan sistem tanda bahaya keadaan darurat diperiksa dan diuji. Lihat pada catatan-catatan inspeksi, pengujian dan sertifikat hasil pengujian dan laporan maintenance-nya beserta penjadwalannya. Seperti pemeriksaan dan pengujian peralatan: hydrant, sprinkle, fire detector, fire alarm, APAR, emergency lamp, emergency shower, breathing apparatus, dll.
Bukti: Disediakan, diperiksa, diuji dan dipelihara secara berkala sesuai peraturan perundangan, standar dan pedoman teknis yang relevan, Catatan inspeksi/pengujian, Sertifikat hasil pengujian, Laporan maintenance beserta penjadwalannya.`, title: "Peralatan darurat (hydrant, APAR, alarm) diperiksa & diuji berkala", docs: [] },
      { id: "6.8.1", interpretasi: `Alat P3K. Ada kegiatan pengecekan terhadap kondisi isi dari kotak P3K, biasanya berupa checklist tentang kelengkapan obat, jumlah pemakaian, penggantian, dll.
Bukti: Pengecekan terhadap kondisi isi dari kotak P3K, Checklist tentang kelengkapan obat, jumlah pemakaian, penggantian, dll.`, title: "Alat P3K dievaluasi sesuai peraturan (checklist kelengkapan)", docs: [] },
      { id: "6.8.2", interpretasi: `Petugas P3K. Ada petugas P3K yang ditunjuk pimpinan perusahaan. Petugas tsb dapat dari lingkungan pekerja atau personil medis di klinik. Pelatihan P3K bagi petugas yang ditunjuk sesuai dengan Permenaker No.Per.03/MEN/1982 tentang Pelayanan Kesehatan Kerja jo. Permenakertrans No.Per.15/MEN/VIII/2008 tentang P3K di Tempat Kerja.
Bukti: Ada petugas P3K yang ditunjuk pimpinan perusahaan, Petugas berasal dari lingkungan pekerja atau personil medis di klinik, Pelatihan P3K sesuai Permenaker No.Per.03/MEN/1982 jo. Permenakertrans No.Per.15/MEN/VIII/2008.`, title: "Petugas P3K dilatih & ditunjuk sesuai peraturan", docs: [] },
      { id: "9.1.1", interpretasi: `Prosedur Penanganan secara manual dan mekanis. Prosedur yang dimaksud yaitu prosedur manajemen risiko seperti pada 2.1.1 dan 6.1.1 tetapi kriteria ini lebih fokus pada kegiatan penanganan bahan secara manual dan mekanis. Bukti penerapannya lihat hasil laporan risk assessment pada kegiatan tsb.
Bukti: Prosedur manajemen risiko untuk penanganan secara manual dan mekanis, Mengacu dokumen manajemen risiko kriteria 2.1.1 dan 6.1.1, Laporan/rekaman HIRARC untuk kegiatan ybs.`, title: "Prosedur HIRARC penanganan material manual & mekanis", docs: [] },
      { id: "9.1.2", interpretasi: `Petugas yang berkompeten. Verifikasi petugas yang melakukan risk assessment.
Bukti: Rekaman/laporan HIRARC, Petugas yang melakukan verifikasi risk assessment, Sertifikat pelatihan manajemen risiko.`, title: "Identifikasi & penilaian risiko material oleh petugas kompeten", docs: [] },
      { id: "9.2.1", interpretasi: `Prosedur penyimpanan dan pemindahan bahan. Semua kriteria ini dapat ditunjukkan dengan suatu prosedur dan penerapannya mengenai penanganan bahan agar teratur dan rapi dalam penyimpanan (housekeeping).
Bukti: Dokumen prosedur, IK dan formulir/checklist penerapannya mengenai penanganan bahan agar teratur dan rapi dalam penyimpanan (housekeeping).`, title: "Prosedur penyimpanan & pemindahan bahan aman (housekeeping)", docs: [] },
      { id: "9.2.3", interpretasi: `Prosedur pembuangan bahan dengan cara yang aman. Bila tidak dipakai akan dibuang dengan cara yang aman (seperti untuk pembuangan limbah oli dipersyaratkan ke penampung yang mempunyai ijin dan limbah cair ke PPLI), dll.
Bukti: Tempat pembuangan sementara, Tempat pembuangan akhir/final, Dokumen/data jenis, jumlah, klasifikasi bahaya, SOP dan IK, Formulir/checklist terkait kegiatan.`, title: "Prosedur pembuangan bahan secara aman sesuai peraturan", docs: [] },
      { id: "9.3.1", interpretasi: `Prosedur mengenai penyimpanan, penanganan dan pemindahan BKB dengan cara yang aman. Ada prosedur tertulis mengenai kegiatan-kegiatan tsb untuk bahan berbahaya, dapat berupa prosedur atau instruksi kerja terkait dengan penggunaan bahan kimia tsb. Peraturan yang mengatur tentang pengendalian bahan kimia berbahaya yaitu Kepmenaker No.Kep.187/MEN/1999.
Bukti: Mengacu peraturan yang mengatur tentang pengendalian bahan kimia berbahaya yaitu Kepmenaker No.Kep.187/MEN/1999.`, title: "Prosedur penyimpanan, penanganan & pemindahan BKB", docs: [] },
      { id: "9.3.3", interpretasi: `Pemberian label pada bahan kimia berbahaya. Ada pelabelan pada wadah bahan kimia, yang penting label ini maksudnya diketahui oleh para pengguna bahan kimia. Bukti penerapan di lapangan yaitu semua wadah bahan kimia mempunyai label yang berisi nama zat, sifat bahaya/rambu bahaya dan tindakan bila keadaan darurat.`, title: "Sistem identifikasi & pelabelan bahan kimia berbahaya", docs: [] },
      { id: "9.3.4", interpretasi: `Rambu peringatan bahaya. Rambu peringatan ini menjelaskan bahaya dari bahan kimia yang ada di tempat kerja, misalnya rambu sifat bahan tsb seperti flammable, explosive, poison, dll.`, title: "Rambu peringatan bahaya bahan kimia terpampang sesuai standar", docs: [] },
    ],
  },
  {
    id: 4,
    code: "fase-4",
    title: "Pemantauan",
    subtitle: "Inspeksi, pengukuran lingkungan & kesehatan kerja",
    color: "#854F0B",
    colorLight: "#FAEEDA",
    target: "Bulan 5–8",
    criteria: [
      { id: "7.1.1", interpretasi: `Prosedur pemeriksaan/inspeksi. Ada jadwal reguler kegiatan inspeksi. Dapat dilihat pada tabel jadwal atau prosedur inspeksi atau dari hasil laporan inspeksi yang telah dilakukan beberapa waktu sebelumnya. Inspeksi cara kerja dapat mengacu kepada job analysis dan inspeksi tempat kerja dapat mengacu kepada hasil identifikasi bahaya (Hazid).
Bukti: Jadwal reguler kegiatan inspeksi, Form/checklist inspeksi tempat kerja dan peralatan kerja, Inspeksi cara kerja mengacu job analysis, Inspeksi tempat kerja mengacu Hazid.`, title: "Inspeksi tempat kerja & cara kerja dilaksanakan secara teratur", docs: [] },
      { id: "7.2.1", interpretasi: `Pemantauan/pengukuran lingkungan kerja. Adanya dokumentasi/laporan hasil pemantauan lingkungan kerja. Interval waktu pelaksanaannya disesuaikan dengan ketentuan/standar yang berlaku.
Bukti: Dilakukan pemantauan/monitoring lingkungan kerja, Jenis pemantauan, Dokumentasi/rekaman laporan hasil pemantauan lingkungan kerja, Interval waktu pelaksanaannya sesuai ketentuan/standar yang berlaku.`, title: "Pemantauan lingkungan kerja teratur & terdokumentasi", docs: [] },
      { id: "7.2.2", interpretasi: `Ruang lingkup pemantauan/pengukuran: faktor fisik, kimia, biologis, radiasi dan psikologis. Lihat laporan hasil pemantauan/monitoring lingkungan kerja. Faktor fisik dan Faktor kimia mengacu pada Permenaker No.Per.13/MEN/X/2011 tentang NAB Faktor Fisika dan Faktor Kimia di Tempat Kerja, Kepmenaker No.Kep.187/MEN/1999 tentang Pengendalian Bahan Kimia Berbahaya di Tempat Kerja, PMP No.7/1964 tentang Penerangan/cahaya, ventilasi, jarak peralatan kerja dan cubic space.`, title: "Pemantauan mencakup faktor fisik, kimia, biologis, radiasi & psikologis", docs: [] },
      { id: "7.2.3", interpretasi: `Petugas atau pihak yang berkompeten.
Bukti: Bukti kompetensi petugas atau pihak yang berkompeten dan berwenang dari dalam dan/atau luar perusahaan. Ref: SE Dirjen BINWASNAKER No.SE-01/DJPPK/2011.`, title: "Pemantauan lingkungan oleh petugas kompeten & berwenang", docs: [] },
      { id: "7.4.1", interpretasi: `Pemantauan kesehatan tenaga kerja. Ada kegiatan dan dokumentasinya (daftar, jadwal, SOP, rekaman pemeriksaan kesehatan) mengenai kegiatan pemantauan kesehatan tenaga kerja, terutama pemeriksaan kesehatan khusus seperti pengecekan darah untuk melihat kontaminasi kadar bahan kimia, audiometri untuk kebisingan, rontgen untuk penyakit saluran pernafasan, dll.
Bukti: Daftar pekerjaan dengan potensi bahaya tinggi (ref. manajemen risiko), Dilakukan pemantauan kesehatan TK yang bekerja pada tempat kerja yang mengandung bahaya tinggi sesuai peraturan perundang-undangan, Kegiatan dan dokumentasinya (daftar, jadwal, SOP, rekaman pemeriksaan kesehatan), Pemeriksaan kesehatan khusus (pengecekan darah, audiometri, rontgen, dll).`, title: "Pemantauan kesehatan TK di area bahaya tinggi sesuai peraturan", docs: [] },
      { id: "7.4.3", interpretasi: `Dokter pemeriksa yang ditunjuk. Pemeriksaan kesehatan tenaga kerja dilakukan oleh dokter perusahaan yang sesuai dengan ketentuan Permenaker No.Per.01/MEN/1976 tentang Kewajiban Latihan Hyperkes Bagi Dokter Perusahaan dan mendapatkan surat penunjukan dari Direktur Jenderal Pembinaan Pengawasan Ketenagakerjaan sebagaimana pasal 8 UU 1/1970 tentang Keselamatan Kerja.`, title: "Pemeriksaan kesehatan oleh dokter pemeriksa yang ditunjuk", docs: [] },
      { id: "7.4.4", interpretasi: `Pelayanan kesehatan kerja. Detail pelayanan kesehatan yang diberikan mengacu pada Permenaker No.Per.03/MEN/1982.
Pelayanan kesehatan tenaga kerja: dilakukan sendiri (poliklinik perusahaan) atau jasa pihak ke III.`, title: "Pelayanan kesehatan kerja tersedia sesuai peraturan", docs: [] },
      { id: "7.4.5", interpretasi: `Catatan mengenai pemantauan kesehatan tenaga kerja. Diwajibkan untuk memberikan pelaporan setiap aktifitas pemeriksaan kesehatan tenaga kerja (rekap medis) yang mengacu pada Permenaker No.Per.02/MEN/1980.
Bukti: Laporan pemeriksaan kesehatan tenaga kerja (rekap medis) yang mengacu pada Permenaker No.Per.02/MEN/1980.`, title: "Catatan pemantauan kesehatan TK sesuai peraturan (rekap medis)", docs: [] },
      { id: "8.3.1", interpretasi: `Prosedur pemeriksaan dan pengkajian kecelakaan kerja dan penyakit akibat kerja. Dokumen sama dengan 8.2.1 dimana dapat disajikan satu prosedur yaitu pelaporan dan penyelidikan.
Bukti: Prosedur pemeriksaan dan pelaporan kecelakaan dan PAK, Formulir/checklist untuk pemeriksaan (ref. Permenaker No.PER.03/MEN/1998 untuk laporan kecelakaan dan Keppres tentang Diagnosa PAK untuk laporan Dokter Pemeriksa Kesehatan Tenaga Kerja).`, title: "Prosedur pemeriksaan & pengkajian kecelakaan kerja dan PAK", docs: [] },
    ],
  },
  {
    id: 5,
    code: "fase-5",
    title: "Evaluasi",
    subtitle: "Audit internal, tinjauan manajemen & pelatihan",
    color: "#993C1D",
    colorLight: "#FAECE7",
    target: "Bulan 7–10",
    criteria: [
      { id: "1.3.3", interpretasi: `Tinjauan berkala pelaksanaan SMK3. Peninjauan ulang pelaksanaan SMK3 secara berkala dilakukan setelah audit internal dan dilaporkan adanya temuan ketidaksesuaian terhadap kriteria audit.
Bukti: Jadwal tinjauan berkala, Jadwal audit internal, Hasil audit internal.`, title: "Tinjauan ulang pelaksanaan SMK3 secara berkala setelah audit", docs: [] },
      { id: "12.2.1", interpretasi: `Anggota manajemen eksekutif dan pengurus berperan serta dalam pelatihan. Manajemen senior terlibat dalam kegiatan pelatihan K3. Terlibat disini termasuk ikut serta dalam pelatihan, minimal pelatihan tentang penjelasan tentang kewajiban hukum dan prinsip-prinsip serta pelaksanaan K3. Dokumen yang dilihat yaitu catatan pelatihan, sertifikat (jika ada) atau kegiatan yang diikuti seperti seminar, dll.`, title: "Manajemen eksekutif berperan dalam pelatihan K3 & kewajiban hukum", docs: [] },
      { id: "12.2.2", interpretasi: `Manajer dan penyelia menerima pelatihan. Pelatihan disini bukan hanya pelatihan K3 yang sesuai dengan peran dan tugasnya namun juga yang berhubungan dengan kompetensi pekerjaannya. Kesesuaiannya dapat dilihat dari job qualification dan atau matriks pelatihan mereka.
Bukti penerapannya dapat dilihat pada rekaman pelatihan dan sertifikat atau daftar riwayat pelatihan.`, title: "Manajer & penyelia menerima pelatihan sesuai peran & tanggung jawab", docs: [] },
      { id: "12.3.1", interpretasi: `Pelatihan diberikan kepada semua tenaga kerja. Setiap tenaga kerja baru mendapatkan pelatihan bagaimana bekerja dengan aman termasuk pengenalan mengenai K3, begitu pula dengan tenaga kerja yang dipindahkan ke bagian yang baru. Lihat pada prosedur pelatihan dan catatan pelatihan.`, title: "Pelatihan K3 untuk semua TK termasuk TK baru & yang dipindahkan", docs: [] },
      { id: "12.5.1", interpretasi: `Sistem untuk menjamin kepatuhan terhadap persyaratan lisensi atau kualifikasi. Perusahaan melakukan identifikasi terhadap kebutuhan pelatihan yang memang dipersyaratkan dalam peraturan perundangan. Lihat pada TNA atau matriks pelatihan yang ada.
Pelatihan yang dipersyaratkan: Ahli K3 Umum (Permenaker No.Per.02/MEN/1992), Dokter perusahaan (Permenaker No.Per.01/MEN/1976), Paramedis (Permenaker No.Per.01/MEN/1979), Juru las (Permenaker No.Per.02/MEN/1982), Operator ketel uap (Permenaker No.Per.01/MEN/1988), Regu kebakaran (Kepmenaker No.Kep.186/MEN/1999), Ahli K3 Kimia dan Petugas K3 Kimia (Kepmenaker No.Kep.187/MEN/1999), Petugas P3K (Permenakertrans No.Per.15/VII/2008), Operator Pesawat Angkat-angkut (Permenakertrans No.Per.09/VII/MEN/2010).`, title: "Sistem jaminan kepatuhan lisensi & kualifikasi (Ahli K3, operator, dll.)", docs: [] },
    ],
  },
];

const STATUS_CONFIG = {
  belum: { label: "Belum mulai", color: "#888780", bg: "#F1EFE8", border: "#D3D1C7" },
  proses: { label: "Sedang berjalan", color: "#854F0B", bg: "#FAEEDA", border: "#FAC775" },
  selesai: { label: "Selesai", color: "#27500A", bg: "#EAF3DE", border: "#97C459" },
};

const INITIAL_USERS = [];

const COMPANY_NAME = "BIMA Shipyard";

// ─────────────────────────────────────────────
// ICONS (Lucide-style inline SVG)
// ─────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor", style = {} }) => {
  const paths = {
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
    chart: "M18 20V10M12 20V4M6 20v-6",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
    check: "M20 6L9 17l-5-5",
    clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
    plus: "M12 5v14M5 12h14",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    x: "M18 6L6 18M6 6l12 12",
    download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    search: "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l4.5 4.5",
    chevronRight: "M9 18l6-6-6-6",
    chevronDown: "M6 9l6 6 6-6",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
    lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M17 11V7a5 5 0 0 0-10 0v4",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    paperclip: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name]?.split(" M").map((d, i) => <path key={i} d={i === 0 ? d : "M" + d} />)}
    </svg>
  );
};

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function RingProgress({ value, size = 80, stroke = 7, color = "#185FA5", bg = "#E6F1FB", label }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size > 60 ? 16 : 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>{Math.round(value)}%</span>
        {label && <span style={{ fontSize: 9, color: "#888", marginTop: 2, textAlign: "center", maxWidth: size - 16 }}>{label}</span>}
      </div>
    </div>
  );
}

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {status === "selesai" && <Icon name="check" size={10} color={cfg.color} />}
      {status === "proses" && <Icon name="clock" size={10} color={cfg.color} />}
      {status === "belum" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />}
      {cfg.label}
    </span>
  );
}

function Modal({ open, onClose, title, children, width = 540 }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.18)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px 14px", borderBottom: "1px solid #f0f0ee" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, color: "#888" }}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>{label}</label>}
      <input {...props} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, fontSize: 14, outline: "none", background: "#fafaf8", color: "#1a1a1a", boxSizing: "border-box", ...props.style }} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>{label}</label>}
      <select {...props} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, fontSize: 14, outline: "none", background: "#fafaf8", color: "#1a1a1a", cursor: "pointer", ...props.style }}>
        {children}
      </select>
    </div>
  );
}

function Btn({ children, variant = "primary", size = "md", ...props }) {
  const styles = {
    primary: { background: "#1a1a2e", color: "#fff", border: "none" },
    secondary: { background: "#f1efe8", color: "#3d3d3a", border: "1.5px solid #e0ded6" },
    danger: { background: "#fcebeb", color: "#a32d2d", border: "1.5px solid #f7c1c1" },
    success: { background: "#EAF3DE", color: "#27500A", border: "1.5px solid #97C459" },
  };
  const sizes = { sm: { padding: "5px 12px", fontSize: 12 }, md: { padding: "8px 16px", fontSize: 13 }, lg: { padding: "11px 22px", fontSize: 14 } };
  return (
    <button {...props} style={{ ...styles[variant], ...sizes[size], borderRadius: 8, fontWeight: 600, cursor: props.disabled ? "not-allowed" : "pointer", opacity: props.disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 6, ...props.style }}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr("Email atau password salah.");
      setLoading(false);
      return;
    }
    // Ambil role dari tabel profiles
    // Gunakan data.session untuk pastikan JWT sudah aktif sebelum query
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', data.user.id)
      .single();
    onLogin({ ...data.user, name: profile?.name || data.user.email, role: profile?.role || 'viewer' });
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f2", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px 44px", width: "100%", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="shield" size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>SMK3 Tracker</div>
            <div style={{ fontSize: 11, color: "#888" }}>{COMPANY_NAME}</div>
          </div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>Selamat datang</h2>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 28px" }}>Masuk untuk melanjutkan</p>
        <form onSubmit={handle}>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@perusahaan.com" required />
          <div style={{ position: "relative", marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>Password</label>
            <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
              style={{ width: "100%", padding: "9px 36px 9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, fontSize: 14, outline: "none", background: "#fafaf8", color: "#1a1a1a", boxSizing: "border-box" }} />
            <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 10, top: 30, background: "none", border: "none", cursor: "pointer", color: "#888" }}>
              <Icon name="eye" size={16} />
            </button>
          </div>
          {err && <div style={{ background: "#fcebeb", color: "#a32d2d", borderRadius: 8, padding: "9px 12px", fontSize: 13, marginBottom: 14 }}>{err}</div>}
          <Btn style={{ width: "100%" }} size="lg" disabled={loading}>{loading ? 'Memuat...' : 'Masuk'}</Btn>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
function Sidebar({ page, setPage, user, onLogout }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "tracker", label: "Tracker Kriteria", icon: "list" },
    { id: "documents", label: "Dokumen", icon: "file" },
    { id: "report", label: "Laporan", icon: "chart" },
    ...(user.role === "admin" ? [{ id: "users", label: "Manajemen User", icon: "users" }] : []),
  ];
  return (
    <div style={{ width: 220, background: "#1a1a2e", minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="shield" size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>SMK3 Tracker</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>64 Kriteria PP 50/2012</div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: page === n.id ? 700 : 400, background: page === n.id ? "rgba(255,255,255,.12)" : "transparent", color: page === n.id ? "#fff" : "rgba(255,255,255,.55)", transition: "all .15s" }}>
              <Icon name={n.icon} size={16} color={page === n.id ? "#fff" : "rgba(255,255,255,.55)"} />
              {n.label}
            </button>
          ))}
        </nav>
      </div>
      <div style={{ marginTop: "auto", padding: "16px 20px 24px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#378ADD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>{user.role === "admin" ? "Administrator" : "Viewer"}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: 8, border: "none", background: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: 12 }}>
          <Icon name="logout" size={14} color="rgba(255,255,255,.5)" /> Keluar
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────
function DashboardPage({ data, setPage }) {
  const totalCriteria = PHASES.reduce((s, p) => s + p.criteria.length, 0);
  const selesai = Object.values(data).filter(d => d.status === "selesai").length;
  const proses = Object.values(data).filter(d => d.status === "proses").length;
  const belum = totalCriteria - selesai - proses;
  const pct = Math.round((selesai / totalCriteria) * 100);

  const overdue = Object.entries(data).filter(([, d]) => {
    if (!d.deadline || d.status === "selesai") return false;
    return new Date(d.deadline) < new Date();
  });

  const upcomingDeadlines = Object.entries(data)
    .filter(([, d]) => d.deadline && d.status !== "selesai")
    .map(([id, d]) => {
      const ph = PHASES.find(p => p.criteria.some(c => c.id === id));
      const cr = ph?.criteria.find(c => c.id === id);
      return { id, title: cr?.title || id, deadline: d.deadline, phase: ph?.title };
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div style={{ padding: "32px 36px", flex: 1, overflowY: "auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Implementasi SMK3 — {COMPANY_NAME}</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total kriteria", value: totalCriteria, icon: "shield", color: "#1a1a2e", bg: "#f1efe8" },
          { label: "Selesai", value: selesai, icon: "check", color: "#27500A", bg: "#EAF3DE" },
          { label: "Sedang berjalan", value: proses, icon: "clock", color: "#854F0B", bg: "#FAEEDA" },
          { label: "Belum mulai", value: belum, icon: "alert", color: "#A32D2D", bg: "#FCEBEB" },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: "#fff", border: "1.5px solid #f0f0ee", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={kpi.icon} size={18} color={kpi.color} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", lineHeight: 1 }}>{kpi.value}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall progress + phase breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: "#fff", border: "1.5px solid #f0f0ee", borderRadius: 14, padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <RingProgress value={pct} size={120} stroke={10} color="#1a1a2e" bg="#f1efe8" />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Progress keseluruhan</div>
            <div style={{ fontSize: 12, color: "#888" }}>{selesai} dari {totalCriteria} kriteria selesai</div>
          </div>
          {overdue.length > 0 && (
            <div style={{ background: "#FCEBEB", border: "1px solid #F7C1C1", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#A32D2D", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="alert" size={13} color="#A32D2D" /> {overdue.length} kriteria melewati deadline
            </div>
          )}
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #f0f0ee", borderRadius: 14, padding: "24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Progress per fase</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PHASES.map(ph => {
              const total = ph.criteria.length;
              const done = ph.criteria.filter(c => data[c.id]?.status === "selesai").length;
              const inprog = ph.criteria.filter(c => data[c.id]?.status === "proses").length;
              const phasePct = Math.round((done / total) * 100);
              return (
                <div key={ph.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: ph.color }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#3d3d3a" }}>Fase {ph.id}: {ph.title}</span>
                      <span style={{ fontSize: 11, color: "#888" }}>{ph.target}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: ph.color }}>{done}/{total}</span>
                  </div>
                  <div style={{ height: 7, background: "#f1efe8", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${phasePct}%`, background: ph.color, borderRadius: 10, transition: "width .5s ease" }} />
                  </div>
                  {inprog > 0 && <div style={{ fontSize: 10, color: "#854F0B", marginTop: 3 }}>{inprog} sedang berjalan</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div style={{ background: "#fff", border: "1.5px solid #f0f0ee", borderRadius: 14, padding: "24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="clock" size={16} /> Deadline terdekat
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcomingDeadlines.map(item => {
              const d = new Date(item.deadline);
              const now = new Date();
              const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
              const isOverdue = diff < 0;
              const isSoon = diff >= 0 && diff <= 7;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: isOverdue ? "#FCEBEB" : isSoon ? "#FAEEDA" : "#f7f6f2", borderRadius: 10 }}>
                  <div style={{ width: 48, textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isOverdue ? "#A32D2D" : "#854F0B" }}>{isOverdue ? "Lewat" : `${diff}h`}</div>
                    <div style={{ fontSize: 10, color: "#888" }}>{d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>[{item.id}] {item.title}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>Fase {item.phase}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Btn variant="secondary" size="sm" style={{ marginTop: 12 }} onClick={() => setPage("tracker")}>
            Lihat semua kriteria
          </Btn>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CRITERIA DETAIL MODAL
// ─────────────────────────────────────────────
function CriteriaModal({ open, onClose, criteriaId, data, onSave, isAdmin, user }) {
  const phase = PHASES.find(p => p.criteria.some(c => c.id === criteriaId));
  const criteria = phase?.criteria.find(c => c.id === criteriaId);
  const entry = data[criteriaId] || { status: "belum", pic: "", deadline: "", notes: "", docs: [] };

  const [form, setForm] = useState({ ...entry });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (open) setForm({ ...entry });
  }, [open, criteriaId]);

  // Fetch dokumen dari tabel documents saat modal dibuka
  useEffect(() => {
    if (!open || !criteriaId) return;
    const fetchDocs = async () => {
      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .eq('criteria_id', criteriaId)
        .order('uploaded_at', { ascending: false });
      setForm(prev => ({ ...prev, docs: docs || [] }));
    };
    fetchDocs();
  }, [open, criteriaId]);

  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    for (const f of files) {
      const filePath = `${criteriaId}/${Date.now()}_${f.name}`;

      // 1. Upload file ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('smk3-documents')
        .upload(filePath, f);

      if (uploadError) {
        console.error('Upload gagal:', uploadError);
        continue;
      }

      // 2. Simpan metadata ke tabel documents
      const { data: docRow, error: dbError } = await supabase
        .from('documents')
        .insert({
          criteria_id: criteriaId,
          file_name: f.name,
          file_path: filePath,
          file_size: f.size,
          file_type: f.type,
          uploaded_by: user?.name || '',
        })
        .select()
        .single();

      if (dbError) { console.error('Simpan metadata gagal:', dbError); continue; }

      // 3. Update local state
      setForm(prev => ({
        ...prev,
        docs: [
          {
            id: docRow.id,
            file_name: docRow.file_name,
            file_path: docRow.file_path,
            file_size: docRow.file_size,
            file_type: docRow.file_type,
            uploaded_at: docRow.uploaded_at,
            uploaded_by: docRow.uploaded_by,
          },
          ...(prev.docs || []),
        ]
      }));
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDownload = async (filePath, fileName) => {
    const { data: signedData, error } = await supabase.storage
      .from('smk3-documents')
      .createSignedUrl(filePath, 60);
    if (error) { console.error(error); return; }
    const a = document.createElement('a');
    a.href = signedData.signedUrl;
    a.download = fileName;
    a.click();
  };

  const removeDoc = async (docId, filePath, idx) => {
    // 1. Hapus dari Storage
    await supabase.storage.from('smk3-documents').remove([filePath]);
    // 2. Hapus metadata dari tabel documents
    await supabase.from('documents').delete().eq('id', docId);
    // 3. Update local state
    setForm(prev => ({ ...prev, docs: prev.docs.filter((_, i) => i !== idx) }));
  };

  const save = () => { onSave(criteriaId, form); onClose(); };

  if (!criteria) return null;

  return (
    <Modal open={open} onClose={onClose} title={`[${criteriaId}] Detail Kriteria`} width={620}>
      <div style={{ marginBottom: 12, padding: 12, background: phase?.colorLight, borderRadius: 8, borderLeft: `3px solid ${phase?.color}` }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: phase?.color, marginBottom: 3 }}>Fase {phase?.id}: {phase?.title}</div>
        <div style={{ fontSize: 13, color: "#3d3d3a", lineHeight: 1.5 }}>{criteria.title}</div>
      </div>

      {criteria.interpretasi && (
        <div style={{ marginBottom: 14, padding: "12px 14px", background: "#f7f6f2", borderRadius: 8, border: "1px solid #e8e8e4" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.4px", display: "flex", alignItems: "center", gap: 5 }}>
            <span>📋</span> Interpretasi &amp; Panduan Audit
          </div>
          <p style={{ fontSize: 12, color: "#3d3d3a", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>
            {criteria.interpretasi}
          </p>
        </div>
      )}

      {isAdmin ? (
        <>
          <Select label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </Select>
          <Input label="PIC (Penanggung Jawab)" value={form.pic} onChange={e => setForm(p => ({ ...p, pic: e.target.value }))} placeholder="Nama penanggung jawab..." />
          <Input label="Target Deadline" type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>Catatan / Progress</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Tuliskan catatan progress, kendala, atau tindak lanjut..."
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, fontSize: 14, outline: "none", background: "#fafaf8", resize: "vertical", fontFamily: "inherit", color: "#1a1a1a", boxSizing: "border-box" }} />
          </div>
        </>
      ) : (
        <div style={{ marginBottom: 14, background: "#f7f6f2", borderRadius: 8, padding: 12, fontSize: 13 }}>
          <div style={{ marginBottom: 6 }}><Badge status={entry.status} /></div>
          {entry.pic && <div style={{ color: "#555" }}><strong>PIC:</strong> {entry.pic}</div>}
          {entry.deadline && <div style={{ color: "#555" }}><strong>Deadline:</strong> {new Date(entry.deadline).toLocaleDateString("id-ID")}</div>}
          {entry.notes && <div style={{ color: "#555", marginTop: 6 }}><strong>Catatan:</strong> {entry.notes}</div>}
        </div>
      )}

      {/* Documents */}
      <div style={{ borderTop: "1px solid #f0f0ee", paddingTop: 14, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Dokumen Bukti ({(form.docs || []).length})</label>
          {isAdmin && (
            <Btn variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Icon name="upload" size={12} /> {uploading ? 'Mengupload...' : 'Upload'}
            </Btn>
          )}
        </div>
        <input ref={fileRef} type="file" multiple style={{ display: "none" }} onChange={handleFile} />
        {(form.docs || []).length === 0 && <div style={{ fontSize: 12, color: "#aaa", textAlign: "center", padding: "16px 0" }}>Belum ada dokumen</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(form.docs || []).map((doc, idx) => (
            <div key={doc.id || idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "#f7f6f2", borderRadius: 8 }}>
              <Icon name="paperclip" size={13} color="#888" />
              <span style={{ flex: 1, fontSize: 12, color: "#3d3d3a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.file_name}</span>
              <span style={{ fontSize: 10, color: "#aaa" }}>{doc.file_size ? (doc.file_size / 1024).toFixed(0) + ' KB' : ''}</span>
              {doc.file_path && (
                <button onClick={() => handleDownload(doc.file_path, doc.file_name)} style={{ background: "none", border: "none", cursor: "pointer", color: "#185FA5", padding: 2 }}>
                  <Icon name="download" size={13} color="#185FA5" />
                </button>
              )}
              {isAdmin && (
                <button onClick={() => removeDoc(doc.id, doc.file_path, idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 2 }}>
                  <Icon name="trash" size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {entry.updatedAt && (
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 12 }}>
          Terakhir diperbarui: {new Date(entry.updatedAt).toLocaleString("id-ID")} oleh {entry.updatedBy}
        </div>
      )}

      {isAdmin && (
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <Btn onClick={save} style={{ flex: 1 }}>Simpan perubahan</Btn>
          <Btn variant="secondary" onClick={onClose}>Batal</Btn>
        </div>
      )}
    </Modal>
  );
}

// ─────────────────────────────────────────────
// TRACKER PAGE
// ─────────────────────────────────────────────
function TrackerPage({ data, onSave, isAdmin, user }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPhase, setFilterPhase] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedPhases, setExpandedPhases] = useState(new Set([1]));
  const [selected, setSelected] = useState(null);

  const togglePhase = id => setExpandedPhases(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const filtered = useMemo(() => {
    return PHASES.map(ph => ({
      ...ph,
      criteria: ph.criteria.filter(cr => {
        const d = data[cr.id] || {};
        const matchStatus = filterStatus === "all" || d.status === filterStatus;
        const matchSearch = !search || cr.id.includes(search) || cr.title.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
      })
    })).filter(ph => (filterPhase === "all" || String(ph.id) === filterPhase) && ph.criteria.length > 0);
  }, [data, filterStatus, filterPhase, search]);

  const stats = useMemo(() => {
    const total = Object.keys(data).length;
    return {
      selesai: Object.values(data).filter(d => d.status === "selesai").length,
      proses: Object.values(data).filter(d => d.status === "proses").length,
      total,
    };
  }, [data]);

  return (
    <div style={{ padding: "32px 36px", flex: 1, overflowY: "auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Tracker Kriteria</h1>
        <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>64 kriteria SMK3 — PP No.50 Tahun 2012</p>
      </div>

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Selesai", count: stats.selesai, color: "#27500A", bg: "#EAF3DE" },
          { label: "Proses", count: stats.proses, color: "#854F0B", bg: "#FAEEDA" },
          { label: "Belum", count: stats.total - stats.selesai - stats.proses, color: "#5F5E5A", bg: "#F1EFE8" },
        ].map(s => (
          <div key={s.label} style={{ padding: "6px 14px", background: s.bg, borderRadius: 20, fontSize: 12, fontWeight: 600, color: s.color }}>
            {s.count} {s.label}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Icon name="search" size={14} color="#aaa" style={{ position: "absolute", left: 10, top: 11 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kriteria..."
            style={{ width: "100%", paddingLeft: 32, paddingRight: 12, height: 36, border: "1.5px solid #e8e8e4", borderRadius: 9, fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <select value={filterPhase} onChange={e => setFilterPhase(e.target.value)}
          style={{ padding: "0 12px", height: 36, border: "1.5px solid #e8e8e4", borderRadius: 9, fontSize: 13, background: "#fff", cursor: "pointer" }}>
          <option value="all">Semua fase</option>
          {PHASES.map(p => <option key={p.id} value={String(p.id)}>Fase {p.id}: {p.title}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: "0 12px", height: 36, border: "1.5px solid #e8e8e4", borderRadius: 9, fontSize: 13, background: "#fff", cursor: "pointer" }}>
          <option value="all">Semua status</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Phases */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(ph => {
          const total = ph.criteria.length;
          const done = ph.criteria.filter(c => data[c.id]?.status === "selesai").length;
          const pct = Math.round((done / total) * 100);
          const expanded = expandedPhases.has(ph.id);
          return (
            <div key={ph.id} style={{ background: "#fff", border: "1.5px solid #f0f0ee", borderRadius: 14, overflow: "hidden" }}>
              <div onClick={() => togglePhase(ph.id)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: "pointer", background: expanded ? ph.colorLight : "#fff", transition: "background .15s" }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: ph.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{ph.id}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Fase {ph.id}: {ph.title}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{ph.subtitle} · {ph.target}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: ph.color }}>{done}/{total}</div>
                    <div style={{ fontSize: 10, color: "#aaa" }}>selesai</div>
                  </div>
                  <div style={{ width: 60, height: 6, background: "#f1efe8", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: ph.color, borderRadius: 10 }} />
                  </div>
                  <Icon name={expanded ? "chevronDown" : "chevronRight"} size={16} color="#aaa" />
                </div>
              </div>

              {expanded && (
                <div style={{ borderTop: `1px solid ${ph.colorLight}` }}>
                  {ph.criteria.map((cr, idx) => {
                    const d = data[cr.id] || {};
                    const status = d.status || "belum";
                    const isOverdue = d.deadline && status !== "selesai" && new Date(d.deadline) < new Date();
                    return (
                      <div key={cr.id} onClick={() => setSelected(cr.id)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: idx < ph.criteria.length - 1 ? "1px solid #f7f6f2" : "none", cursor: "pointer", transition: "background .1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"}
                        onMouseLeave={e => e.currentTarget.style.background = ""}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: ph.color, minWidth: 42, flexShrink: 0 }}>{cr.id}</span>
                        <span style={{ flex: 1, fontSize: 13, color: "#3d3d3a", lineHeight: 1.4 }}>{cr.title}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          {d.pic && <span style={{ fontSize: 11, color: "#888", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.pic}</span>}
                          {d.deadline && (
                            <span style={{ fontSize: 11, color: isOverdue ? "#A32D2D" : "#854F0B", fontWeight: isOverdue ? 700 : 400 }}>
                              {new Date(d.deadline).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                            </span>
                          )}
                          {(d.docs || []).length > 0 && <span style={{ fontSize: 10, color: "#185FA5", display: "flex", alignItems: "center", gap: 2 }}><Icon name="paperclip" size={11} color="#185FA5" />{d.docs.length}</span>}
                          <Badge status={status} />
                          <Icon name="chevronRight" size={13} color="#ccc" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CriteriaModal
        open={!!selected} onClose={() => setSelected(null)}
        criteriaId={selected} data={data}
        onSave={(id, form) => onSave(id, { ...form, updatedAt: new Date().toISOString(), updatedBy: user.name })}
        isAdmin={isAdmin} user={user} />
    </div>
  );
}

// ─────────────────────────────────────────────
// DOCUMENTS PAGE
// ─────────────────────────────────────────────
function DocumentsPage({ data }) {
  const [filterPhase, setFilterPhase] = useState("all");
  const [search, setSearch] = useState("");

  const allDocs = useMemo(() => {
    const result = [];
    PHASES.forEach(ph => {
      ph.criteria.forEach(cr => {
        const d = data[cr.id] || {};
        (d.docs || []).forEach(doc => {
          result.push({ ...doc, criteriaId: cr.id, criteriaTitle: cr.title, phaseId: ph.id, phaseTitle: ph.title, phaseColor: ph.color });
        });
      });
    });
    return result;
  }, [data]);

  const filtered = allDocs.filter(doc => {
    const matchPhase = filterPhase === "all" || String(doc.phaseId) === filterPhase;
    const matchSearch = !search || (doc.file_name || '').toLowerCase().includes(search.toLowerCase()) || doc.criteriaId.includes(search);
    return matchPhase && matchSearch;
  });

  const byType = (type) => {
    if (!type) return "#888";
    if (type.includes("pdf")) return "#E24B4A";
    if (type.includes("image")) return "#185FA5";
    if (type.includes("word") || type.includes("document")) return "#0F6E56";
    return "#888";
  };

  const handleDownload = async (filePath, fileName) => {
    const { data: signedData, error } = await supabase.storage
      .from('smk3-documents')
      .createSignedUrl(filePath, 60);
    if (error) { console.error(error); return; }
    const a = document.createElement('a');
    a.href = signedData.signedUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <div style={{ padding: "32px 36px", flex: 1, overflowY: "auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Dokumen</h1>
        <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>{allDocs.length} file terupload dari {PHASES.reduce((s, p) => s + p.criteria.length, 0)} kriteria</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Icon name="search" size={14} color="#aaa" style={{ position: "absolute", left: 10, top: 11 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari dokumen..."
            style={{ width: "100%", paddingLeft: 32, paddingRight: 12, height: 36, border: "1.5px solid #e8e8e4", borderRadius: 9, fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" }} />
        </div>
        <select value={filterPhase} onChange={e => setFilterPhase(e.target.value)}
          style={{ padding: "0 12px", height: 36, border: "1.5px solid #e8e8e4", borderRadius: 9, fontSize: 13, background: "#fff", cursor: "pointer" }}>
          <option value="all">Semua fase</option>
          {PHASES.map(p => <option key={p.id} value={String(p.id)}>Fase {p.id}: {p.title}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
          <Icon name="file" size={40} color="#ddd" />
          <div style={{ marginTop: 12, fontSize: 14 }}>Belum ada dokumen</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Upload dokumen melalui halaman Tracker Kriteria</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filtered.map((doc, idx) => (
            <div key={doc.id || idx} style={{ background: "#fff", border: "1.5px solid #f0f0ee", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: byType(doc.file_type) + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="file" size={18} color={byType(doc.file_type)} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.file_name}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                  <span style={{ color: doc.phaseColor, fontWeight: 600 }}>[{doc.criteriaId}]</span> {doc.criteriaTitle.substring(0, 40)}...
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#aaa" }}>{doc.file_size ? (doc.file_size / 1024).toFixed(0) + ' KB' : ''}</span>
                  {doc.file_path && (
                    <button onClick={() => handleDownload(doc.file_path, doc.file_name)}
                      style={{ fontSize: 11, color: "#185FA5", display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      <Icon name="download" size={11} color="#185FA5" /> Unduh
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// REPORT PAGE
// ─────────────────────────────────────────────
function ReportPage({ data }) {
  const totalCriteria = PHASES.reduce((s, p) => s + p.criteria.length, 0);
  const selesai = Object.values(data).filter(d => d.status === "selesai").length;
  const proses = Object.values(data).filter(d => d.status === "proses").length;
  const belum = totalCriteria - selesai - proses;
  const pct = Math.round((selesai / totalCriteria) * 100);
  const today = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  const printReport = () => window.print();

  return (
    <div className="report-page" style={{ padding: "32px 36px", flex: 1, overflowY: "auto" }}>
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Laporan Implementasi SMK3</h1>
          <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Per tanggal {today}</p>
        </div>
        <Btn onClick={printReport}><Icon name="download" size={14} /> Cetak / Export PDF</Btn>
      </div>

      {/* Print-only header */}
      <div className="print-only" style={{ display: "none", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>Laporan Implementasi SMK3</div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{COMPANY_NAME} · Per tanggal {today}</div>
      </div>

      <div className="report-content">
        {/* Header report */}
        <div style={{ background: "#1a1a2e", borderRadius: 14, padding: "24px 28px", marginBottom: 20, color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>Status Implementasi SMK3</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)" }}>{COMPANY_NAME} · Berdasarkan PP No.50 Tahun 2012</div>
            </div>
            <RingProgress value={pct} size={90} stroke={8} color="#5DCAA5" bg="rgba(255,255,255,.15)" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
            {[
              { label: "Selesai", val: selesai, color: "#5DCAA5" },
              { label: "Sedang berjalan", val: proses, color: "#FAC775" },
              { label: "Belum mulai", val: belum, color: "#F09595" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,.07)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-phase table */}
        <div style={{ background: "#fff", border: "1.5px solid #f0f0ee", borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0ee", fontWeight: 700, fontSize: 14 }}>Ringkasan per fase</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f7f6f2" }}>
                {["Fase", "Target", "Total", "Selesai", "Proses", "Belum", "Progress"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: h === "Fase" ? "left" : "center", fontSize: 11, fontWeight: 700, color: "#888", borderBottom: "1px solid #f0f0ee" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PHASES.map(ph => {
                const tot = ph.criteria.length;
                const don = ph.criteria.filter(c => data[c.id]?.status === "selesai").length;
                const inp = ph.criteria.filter(c => data[c.id]?.status === "proses").length;
                const bel = tot - don - inp;
                const pp = Math.round((don / tot) * 100);
                return (
                  <tr key={ph.id} style={{ borderBottom: "1px solid #f7f6f2" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: ph.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>{ph.id}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1a1a1a" }}>{ph.title}</div>
                          <div style={{ fontSize: 11, color: "#888" }}>{ph.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", color: "#888", fontSize: 12 }}>{ph.target}</td>
                    <td style={{ textAlign: "center", fontWeight: 700 }}>{tot}</td>
                    <td style={{ textAlign: "center", color: "#27500A", fontWeight: 600 }}>{don}</td>
                    <td style={{ textAlign: "center", color: "#854F0B", fontWeight: 600 }}>{inp}</td>
                    <td style={{ textAlign: "center", color: "#888" }}>{bel}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: "#f1efe8", borderRadius: 10, overflow: "hidden" }}>
                          <div style={{ width: `${pp}%`, height: "100%", background: ph.color, borderRadius: 10 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: ph.color, minWidth: 30 }}>{pp}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Full criteria list */}
        <div style={{ background: "#fff", border: "1.5px solid #f0f0ee", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0ee", fontWeight: 700, fontSize: 14 }}>Detail semua kriteria</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#f7f6f2" }}>
                {["No.", "Kriteria", "Catatan", "Interpretasi & Panduan Audit", "Status"].map(h => (
                  <th key={h} style={{
                    padding: "9px 12px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#888",
                    borderBottom: "1px solid #f0f0ee",
                    width: h === "No." ? "5%" : h === "Kriteria" ? "20%" : h === "Catatan" ? "18%" : h === "Interpretasi & Panduan Audit" ? "42%" : "10%",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PHASES.flatMap(ph =>
                ph.criteria.map((cr, i) => {
                  const d = data[cr.id] || {};
                  return (
                    <tr key={cr.id} style={{ borderBottom: "1px solid #f7f6f2", background: i % 2 === 0 ? "#fff" : "#fafaf8" }}>
                      <td style={{ padding: "8px 12px", fontWeight: 700, color: ph.color, whiteSpace: "nowrap" }}>{cr.id}</td>
                      <td style={{ padding: "8px 12px", color: "#3d3d3a", wordWrap: "break-word" }}>{cr.title}</td>
                      <td style={{ padding: "8px 12px", color: "#555", wordWrap: "break-word" }}>{d.notes || "—"}</td>
                      <td style={{ padding: "8px 12px", color: "#555", fontSize: 11, lineHeight: 1.6, whiteSpace: "pre-line", wordWrap: "break-word" }}>{cr.interpretasi || "—"}</td>
                      <td style={{ padding: "8px 12px" }}><Badge status={d.status || "belum"} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// USERS PAGE (admin only)
// ─────────────────────────────────────────────
function UsersPage({ currentUser }) {
  const [users, setUsersState] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "viewer" });
  const [editId, setEditId] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at');
      if (!error) setUsersState(data || []);
      setLoadingUsers(false);
    };
    fetchUsers();
  }, []);

  const openAdd = () => { setForm({ name: "", email: "", role: "viewer" }); setEditId(null); setModal(true); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, role: u.role }); setEditId(u.id); setModal(true); };

  const save = async () => {
    if (!form.name || !form.email) return;
    if (editId) {
      // Update nama dan role di tabel profiles
      const { error } = await supabase
        .from('profiles')
        .update({ name: form.name, role: form.role })
        .eq('id', editId);
      if (!error) {
        setUsersState(prev => prev.map(u => u.id === editId ? { ...u, name: form.name, role: form.role } : u));
      }
    }
    // Catatan: tambah user baru dilakukan via Supabase Dashboard (invite user)
    setModal(false);
  };

  const remove = async (id) => {
    if (id === currentUser.id) return alert("Tidak bisa menghapus akun sendiri.");
    // Hapus dari auth.users (cascade ke profiles via FK)
    const { error } = await supabase.auth.admin?.deleteUser(id);
    if (!error) {
      setUsersState(prev => prev.filter(u => u.id !== id));
    } else {
      alert("Hapus user hanya bisa dilakukan via Supabase Dashboard.");
    }
  };

  return (
    <div style={{ padding: "32px 36px", flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>Manajemen User</h1>
          <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>{users.length} user terdaftar</p>
        </div>
        <Btn onClick={openAdd}><Icon name="plus" size={14} color="#fff" /> Tambah user</Btn>
      </div>

      {loadingUsers ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>Memuat data user...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {users.map(u => (
            <div key={u.id} style={{ background: "#fff", border: "1.5px solid #f0f0ee", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: u.role === "admin" ? "#EEEDFE" : "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: u.role === "admin" ? "#534AB7" : "#185FA5" }}>
                {(u.name || u.email || '?').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{u.name} {u.id === currentUser.id && <span style={{ fontSize: 10, background: "#EAF3DE", color: "#27500A", padding: "2px 6px", borderRadius: 6, marginLeft: 6 }}>Anda</span>}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{u.email}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: u.role === "admin" ? "#EEEDFE" : "#E6F1FB", color: u.role === "admin" ? "#534AB7" : "#185FA5" }}>
                  {u.role === "admin" ? "Administrator" : "Viewer"}
                </span>
                <Btn variant="secondary" size="sm" onClick={() => openEdit(u)}><Icon name="edit" size={12} /></Btn>
                {u.id !== currentUser.id && <Btn variant="danger" size="sm" onClick={() => remove(u.id)}><Icon name="trash" size={12} /></Btn>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? "Edit User" : "Tambah User Baru"} width={440}>
        {editId ? (
          <>
            <Input label="Nama lengkap" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nama..." />
            <Select label="Role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="admin">Administrator (bisa edit)</option>
              <option value="viewer">Viewer (hanya lihat)</option>
            </Select>
          </>
        ) : (
          <div style={{ background: "#f7f6f2", borderRadius: 8, padding: "14px 16px", fontSize: 13, color: "#555", marginBottom: 16 }}>
            <strong>Cara menambah user baru:</strong>
            <ol style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Buka <strong>Supabase Dashboard → Authentication → Users</strong></li>
              <li>Klik <strong>Invite user</strong> dan masukkan email</li>
              <li>Setelah user konfirmasi, update role-nya via SQL atau edit di halaman ini</li>
            </ol>
          </div>
        )}
        <div style={{ background: "#f7f6f2", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#888", marginBottom: 16 }}>
          <strong>Admin</strong> dapat mengubah status, PIC, deadline, catatan, dan upload dokumen.<br />
          <strong>Viewer</strong> hanya dapat melihat data tanpa bisa melakukan perubahan.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {editId && <Btn onClick={save} style={{ flex: 1 }}>Simpan</Btn>}
          <Btn variant="secondary" onClick={() => setModal(false)} style={{ flex: editId ? 0 : 1 }}>Tutup</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState({});
  const [dataLoading, setDataLoading] = useState(true);

  // Cek session saat app dibuka & listen perubahan auth
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', session.user.id)
          .single();
        setUser({ ...session.user, name: profile?.name || session.user.email, role: profile?.role || 'viewer' });
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') { setUser(null); setData({}); setDataLoading(true); }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data kriteria dari Supabase setelah login
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setDataLoading(true);
      const { data: rows, error } = await supabase.from('criteria_data').select('*');
      if (error) { console.error(error); setDataLoading(false); return; }
      const mapped = {};
      rows.forEach(row => {
        mapped[row.id] = {
          status: row.status,
          pic: row.pic || '',
          deadline: row.deadline || '',
          notes: row.notes || '',
          docs: [],
          updatedAt: row.updated_at,
          updatedBy: row.updated_by || '',
        };
      });
      setData(mapped);
      setDataLoading(false);
    };
    fetchData();
  }, [user]);

  const handleLogin = (u) => { setUser(u); };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setData({});
    setPage("dashboard");
  };

  const handleSave = async (id, form) => {
    const { error } = await supabase
      .from('criteria_data')
      .upsert({
        id,
        status: form.status,
        pic: form.pic,
        deadline: form.deadline || null,
        notes: form.notes,
        updated_at: new Date().toISOString(),
        updated_by: user.name,
      });
    if (error) { console.error('Gagal simpan:', error); return; }
    setData(prev => ({
      ...prev,
      [id]: { ...form, updatedAt: new Date().toISOString(), updatedBy: user.name }
    }));
  };

  // Tampilkan loading screen sementara cek session
  if (authLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", background: '#f7f6f2', color: '#888', fontSize: 14 }}>
      Memuat...
    </div>
  );

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const isAdmin = user.role === "admin";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f6f2", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}>
      <div className="no-print" style={{ display: "contents" }}>
        <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      </div>
      <div className="app-main" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {dataLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#888', fontSize: 14 }}>Memuat data...</div>
        ) : (
          <>
            {page === "dashboard" && <DashboardPage data={data} setPage={setPage} />}
            {page === "tracker" && <TrackerPage data={data} onSave={handleSave} isAdmin={isAdmin} user={user} />}
            {page === "documents" && <DocumentsPage data={data} />}
            {page === "report" && <ReportPage data={data} />}
            {page === "users" && isAdmin && <UsersPage currentUser={user} />}
          </>
        )}
      </div>
    </div>
  );
}
