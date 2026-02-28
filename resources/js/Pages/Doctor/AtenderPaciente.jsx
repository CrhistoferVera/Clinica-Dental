import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';

// ─── DENTAL CONSTANTS ──────────────────────────────────────────────────────────

const CONDITIONS = [
    { id: 'sano',       label: 'Sano',              color: '#ffffff', border: '#9ca3af', textDark: true },
    { id: 'caries',     label: 'Caries',            color: '#ef4444', border: '#dc2626', textDark: false },
    { id: 'obturacion', label: 'Obturación',        color: '#3b82f6', border: '#2563eb', textDark: false },
    { id: 'endodoncia', label: 'Endodoncia',        color: '#fcd34d', border: '#d97706', textDark: true },
    { id: 'corona',     label: 'Corona',            color: '#fb923c', border: '#ea580c', textDark: false },
    { id: 'extraccion', label: 'Extracción ind.',   color: '#d1d5db', border: '#6b7280', textDark: true },
    { id: 'ausente',    label: 'Ausente',           color: '#374151', border: '#111827', textDark: false },
    { id: 'fractura',   label: 'Fractura',          color: '#92400e', border: '#78350f', textDark: false },
];

const COLORS = Object.fromEntries(CONDITIONS.map(c => [c.id, c.color]));

// FDI Notation – adult teeth
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];

// FDI Notation – primary (deciduous) teeth
const PRIM_UPPER_RIGHT = [55, 54, 53, 52, 51];
const PRIM_UPPER_LEFT  = [61, 62, 63, 64, 65];
const PRIM_LOWER_LEFT  = [71, 72, 73, 74, 75];
const PRIM_LOWER_RIGHT = [85, 84, 83, 82, 81];

const SURFACE_LABELS = { V: 'Vestibular', L: 'Lingual', M: 'Mesial', D: 'Distal', O: 'Oclusal' };

// ─── TOOTH SVG ─────────────────────────────────────────────────────────────────

function ToothSVG({ toothNum, surfaces, onSurfaceClick, isInPlan }) {
    const W = 30, H = 34, R = 9;

    const getColor = (surf) => COLORS[surfaces?.[surf] || 'sano'];

    const hasAnyMark = surfaces &&
        Object.values(surfaces).some(v => v && v !== 'sano');

    const allExtOrAbsent = surfaces &&
        Object.values(surfaces).every(v => v === 'extraccion' || v === 'ausente');

    const handleClick = (e, surf) => {
        e.stopPropagation();
        onSurfaceClick(toothNum, surf);
    };

    return (
        <div className="flex flex-col items-center select-none">
            <div
                className={`rounded-sm transition-all ${
                    isInPlan ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                }`}
                title={`Diente ${toothNum}`}
            >
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ cursor: 'crosshair' }}>
                    {/* Vestibular – top */}
                    <polygon
                        points={`0,0 ${W},0 ${W-R},${R} ${R},${R}`}
                        fill={getColor('V')} stroke="#9ca3af" strokeWidth="0.5"
                        onClick={(e) => handleClick(e, 'V')}
                    />
                    {/* Lingual – bottom */}
                    <polygon
                        points={`${R},${H-R} ${W-R},${H-R} ${W},${H} 0,${H}`}
                        fill={getColor('L')} stroke="#9ca3af" strokeWidth="0.5"
                        onClick={(e) => handleClick(e, 'L')}
                    />
                    {/* Mesial – left */}
                    <polygon
                        points={`0,0 ${R},${R} ${R},${H-R} 0,${H}`}
                        fill={getColor('M')} stroke="#9ca3af" strokeWidth="0.5"
                        onClick={(e) => handleClick(e, 'M')}
                    />
                    {/* Distal – right */}
                    <polygon
                        points={`${W},0 ${W},${H} ${W-R},${H-R} ${W-R},${R}`}
                        fill={getColor('D')} stroke="#9ca3af" strokeWidth="0.5"
                        onClick={(e) => handleClick(e, 'D')}
                    />
                    {/* Oclusal – center */}
                    <rect
                        x={R} y={R} width={W - 2 * R} height={H - 2 * R}
                        fill={getColor('O')} stroke="#9ca3af" strokeWidth="0.5"
                        onClick={(e) => handleClick(e, 'O')}
                    />
                    {/* Cross mark for extraction / absent */}
                    {allExtOrAbsent && (
                        <>
                            <line x1="3" y1="3" x2={W-3} y2={H-3} stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
                            <line x1={W-3} y1="3" x2="3" y2={H-3} stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
                        </>
                    )}
                </svg>
            </div>
            <div
                className={`text-center leading-none mt-0.5 font-mono ${
                    hasAnyMark ? 'text-indigo-600 font-bold' : 'text-gray-400'
                }`}
                style={{ fontSize: '9px' }}
            >
                {toothNum}
            </div>
        </div>
    );
}

// ─── ARCH DIVIDER ──────────────────────────────────────────────────────────────

function ArchDivider() {
    return (
        <div className="relative my-2">
            <div className="border-t-2 border-dashed border-gray-300" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-gray-50 px-2 text-[10px] text-gray-400">
                línea media
            </span>
        </div>
    );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function AtenderPaciente({ cita, patient, historial, doctor }) {
    const [loading, setLoading]                     = useState(false);
    const [mostrarHistorial, setMostrarHistorial]   = useState(false);
    const [generarReceta, setGenerarReceta]         = useState(false);
    const [condicion, setCondicion]                 = useState('caries');
    const [mostrarTemporales, setMostrarTemporales] = useState(false);

    // { '36': { V:'sano', M:'caries', O:'caries', D:'sano', L:'sano' }, ... }
    const [odontograma, setOdontograma] = useState({});

    // [{ pieza:'36', diagnostico:'', tratamiento:'', costo:'' }, ...]
    const [plan, setPlan] = useState([]);

    const [form, setForm] = useState({
        appointment_id:       cita?.id   || null,
        patient_id:           patient?.id || null,
        motivo_consulta:      cita?.notes || '',
        sintomas:             '',
        diagnostico:          '',
        tratamiento:          '',
        observaciones:        '',
        proxima_cita_sugerida:'',
        medicamentos: [{ medicamento:'', dosis:'', frecuencia:'', duracion:'', indicaciones:'' }],
    });

    // ── Odontogram interaction ────────────────────────────────────────────────

    const handleSurface = (toothNum, surface) => {
        const key = String(toothNum);
        setOdontograma(prev => {
            const tooth = prev[key] || { V:'sano', M:'sano', O:'sano', D:'sano', L:'sano' };
            const next  = tooth[surface] === condicion ? 'sano' : condicion;
            return { ...prev, [key]: { ...tooth, [surface]: next } };
        });
        if (condicion !== 'sano') {
            setPlan(prev =>
                prev.find(r => r.pieza === String(toothNum))
                    ? prev
                    : [...prev, { pieza: String(toothNum), diagnostico: '', tratamiento: '', costo: '' }]
            );
        }
    };

    // ── Plan de tratamiento ────────────────────────────────────────────────────

    const updateRow = (i, field, val) =>
        setPlan(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

    const removeRow = (i) =>
        setPlan(prev => prev.filter((_, idx) => idx !== i));

    const addRow = () =>
        setPlan(prev => [...prev, { pieza:'', diagnostico:'', tratamiento:'', costo:'' }]);

    const costoTotal = plan.reduce((s, r) => s + (parseFloat(r.costo) || 0), 0);

    // ── Form helpers ──────────────────────────────────────────────────────────

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const agregarMed = () =>
        setForm(p => ({ ...p, medicamentos: [...p.medicamentos, { medicamento:'', dosis:'', frecuencia:'', duracion:'', indicaciones:'' }] }));

    const quitarMed = (i) =>
        setForm(p => ({ ...p, medicamentos: p.medicamentos.filter((_, idx) => idx !== i) }));

    const updateMed = (i, campo, val) => {
        const meds = [...form.medicamentos];
        meds[i][campo] = val;
        setForm(p => ({ ...p, medicamentos: meds }));
    };

    // ── Actions ───────────────────────────────────────────────────────────────

    const marcarNoAsistio = async () => {
        if (!confirm('¿Confirmar que el paciente no asistió?')) return;
        try {
            const res = await fetch(`/doctor/api/cita/${cita.id}/no-asistio`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
            });
            if (res.ok) router.visit('/doctor/panel');
        } catch { alert('Error al actualizar la cita'); }
    };

    const guardarAtencion = async () => {
        if (!form.motivo_consulta || !form.diagnostico || !form.tratamiento) {
            alert('Completa los campos obligatorios: Motivo, Diagnóstico y Tratamiento');
            return;
        }
        if (generarReceta && form.medicamentos.some(m => !m.medicamento)) {
            alert('Completa el nombre de todos los medicamentos');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/doctor/api/atencion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    ...form,
                    generar_receta:  generarReceta,
                    medicamentos:    generarReceta ? form.medicamentos : [],
                    odontograma,
                    plan_tratamiento: plan,
                }),
            });
            const result = await res.json();
            if (res.ok) { alert('Atención registrada exitosamente'); router.visit('/doctor/panel'); }
            else alert(result.message || 'Error al guardar la atención');
        } catch { alert('Error de conexión'); }
        finally { setLoading(false); }
    };

    // ── Utilities ─────────────────────────────────────────────────────────────

    const calcEdad = (fn) => {
        if (!fn) return null;
        const hoy = new Date(), nac = new Date(fn);
        let e = hoy.getFullYear() - nac.getFullYear();
        const m = hoy.getMonth() - nac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) e--;
        return e;
    };

    const edad        = patient ? calcEdad(patient.fecha_nacimiento) : null;
    const citaAtendida = cita?.status === 'atendida';

    // ── Reusable tooth row ────────────────────────────────────────────────────

    const TeethRow = ({ teeth }) => (
        <div className="flex gap-1 justify-center">
            {teeth.map(n => (
                <ToothSVG
                    key={n}
                    toothNum={n}
                    surfaces={odontograma[String(n)]}
                    onSurfaceClick={handleSurface}
                    isInPlan={plan.some(r => r.pieza === String(n))}
                />
            ))}
        </div>
    );

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {citaAtendida ? 'Detalle de Atención' : 'Atender Paciente'}
                    </h2>
                    <Link href="/doctor/panel" className="text-sm text-indigo-600 hover:text-indigo-900">
                        ← Volver al panel
                    </Link>
                </div>
            }
        >
            <Head title={citaAtendida ? 'Detalle de Atención' : 'Atender Paciente'} />

            <div className="py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* ════ PATIENT INFO ════════════════════════════════════════ */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-start flex-wrap gap-3">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {patient
                                        ? `${patient.nombre} ${patient.apellido}`
                                        : `${cita?.patient_name} ${cita?.patient_lastname}`}
                                </h3>
                                <p className="text-gray-500 mt-1">
                                    CI: {patient?.ci || cita?.patient_dni}
                                    {edad != null && ` • ${edad} años`}
                                </p>
                                {patient?.telefono && <p className="text-gray-500">Tel: {patient.telefono}</p>}
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                <p className="font-medium text-gray-700">
                                    {cita?.time_start?.slice(0, 5)} hrs
                                </p>
                                <p>{new Date(cita?.date).toLocaleDateString('es-BO')}</p>
                            </div>
                        </div>

                        {patient?.alergias && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                                <span className="font-semibold text-red-800">⚠️ Alergias:</span>
                                <span className="text-red-700 ml-2">{patient.alergias}</span>
                            </div>
                        )}
                        {patient?.antecedentes && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                                <span className="font-semibold text-blue-800">📋 Antecedentes:</span>
                                <span className="text-blue-700 ml-2">{patient.antecedentes}</span>
                            </div>
                        )}
                        {historial?.length > 0 && (
                            <button
                                onClick={() => setMostrarHistorial(true)}
                                className="mt-4 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                                📁 Ver historial ({historial.length} atenciones previas)
                            </button>
                        )}
                    </div>

                    {!citaAtendida ? (
                        <>
                            {/* ════ ODONTOGRAM ══════════════════════════════════ */}
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                                    <h4 className="text-lg font-semibold text-gray-900">Odontograma</h4>
                                    <button
                                        onClick={() => setMostrarTemporales(v => !v)}
                                        className="text-sm text-indigo-600 hover:text-indigo-900 font-medium border border-indigo-200 rounded-full px-3 py-1"
                                    >
                                        {mostrarTemporales ? '🦷 Ver dientes adultos' : '👶 Ver dientes temporales'}
                                    </button>
                                </div>

                                {/* Condition palette */}
                                <div className="mb-5">
                                    <p className="text-xs font-medium text-gray-500 mb-2">
                                        Condición activa → haz clic en la superficie del diente para marcarla:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {CONDITIONS.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => setCondicion(c.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                                                    condicion === c.id
                                                        ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110 shadow-md'
                                                        : 'hover:scale-105 opacity-80'
                                                }`}
                                                style={{
                                                    backgroundColor: c.color,
                                                    borderColor: c.border,
                                                    color: c.textDark ? '#374151' : '#ffffff',
                                                }}
                                            >
                                                {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tooth chart */}
                                <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
                                    {!mostrarTemporales ? (
                                        <div className="space-y-1 min-w-[520px]">
                                            <div className="flex justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1 px-1">
                                                <span>Der. paciente</span>
                                                <span className="text-indigo-500">SUPERIOR</span>
                                                <span>Izq. paciente</span>
                                            </div>
                                            <div className="flex justify-center gap-1 items-end">
                                                <TeethRow teeth={UPPER_RIGHT} />
                                                <div className="w-px h-10 bg-gray-300 mx-1 self-center" />
                                                <TeethRow teeth={UPPER_LEFT} />
                                            </div>
                                            <ArchDivider />
                                            <div className="flex justify-center gap-1 items-start">
                                                <TeethRow teeth={LOWER_RIGHT} />
                                                <div className="w-px h-10 bg-gray-300 mx-1 self-center" />
                                                <TeethRow teeth={LOWER_LEFT} />
                                            </div>
                                            <div className="text-center text-[10px] font-semibold text-indigo-500 uppercase tracking-wide mt-1">
                                                INFERIOR
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 min-w-[340px]">
                                            <div className="text-center text-[10px] font-semibold text-indigo-500 uppercase tracking-wide mb-1">
                                                SUPERIOR TEMPORAL
                                            </div>
                                            <div className="flex justify-center gap-1 items-end">
                                                <TeethRow teeth={PRIM_UPPER_RIGHT} />
                                                <div className="w-px h-10 bg-gray-300 mx-1 self-center" />
                                                <TeethRow teeth={PRIM_UPPER_LEFT} />
                                            </div>
                                            <ArchDivider />
                                            <div className="flex justify-center gap-1 items-start">
                                                <TeethRow teeth={PRIM_LOWER_RIGHT} />
                                                <div className="w-px h-10 bg-gray-300 mx-1 self-center" />
                                                <TeethRow teeth={PRIM_LOWER_LEFT} />
                                            </div>
                                            <div className="text-center text-[10px] font-semibold text-indigo-500 uppercase tracking-wide mt-1">
                                                INFERIOR TEMPORAL
                                            </div>
                                        </div>
                                    )}

                                    {/* Surface legend */}
                                    <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
                                        <span className="font-semibold text-gray-600">Superficies:</span>
                                        {Object.entries(SURFACE_LABELS).map(([k, v]) => (
                                            <span key={k}><strong>{k}</strong> = {v}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ════ PLAN DE TRATAMIENTO ═════════════════════════ */}
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                                    <h4 className="text-lg font-semibold text-gray-900">Plan de Tratamiento</h4>
                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="text-sm text-indigo-600 hover:text-indigo-900 font-medium border border-indigo-200 rounded-full px-3 py-1"
                                    >
                                        + Agregar pieza
                                    </button>
                                </div>

                                {plan.length > 0 ? (
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-indigo-50">
                                                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide w-20">Pieza</th>
                                                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide">Diagnóstico</th>
                                                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide">Tratamiento</th>
                                                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide w-32">Costo (Bs)</th>
                                                    <th className="px-3 py-2.5 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {plan.map((row, i) => (
                                                    <tr key={i} className="hover:bg-indigo-50/30">
                                                        <td className="px-3 py-2">
                                                            <input
                                                                type="text"
                                                                value={row.pieza}
                                                                onChange={e => updateRow(i, 'pieza', e.target.value)}
                                                                className="w-16 text-center rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono font-bold"
                                                                placeholder="Ej: 36"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <input
                                                                type="text"
                                                                value={row.diagnostico}
                                                                onChange={e => updateRow(i, 'diagnostico', e.target.value)}
                                                                className="w-full rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                placeholder="Ej: Caries profunda"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <input
                                                                type="text"
                                                                value={row.tratamiento}
                                                                onChange={e => updateRow(i, 'tratamiento', e.target.value)}
                                                                className="w-full rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                placeholder="Ej: Obturación resina"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <input
                                                                type="number"
                                                                value={row.costo}
                                                                onChange={e => updateRow(i, 'costo', e.target.value)}
                                                                className="w-24 rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                placeholder="0.00"
                                                                min="0"
                                                                step="0.50"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 text-center">
                                                            <button
                                                                onClick={() => removeRow(i)}
                                                                className="text-red-400 hover:text-red-600 text-xl font-bold leading-none"
                                                                title="Eliminar"
                                                            >×</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-indigo-50 font-bold">
                                                    <td colSpan="3" className="px-3 py-2.5 text-right text-indigo-800 text-sm">
                                                        COSTO TOTAL:
                                                    </td>
                                                    <td className="px-3 py-2.5 text-indigo-900 font-bold">
                                                        Bs {costoTotal.toFixed(2)}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                        <div className="text-5xl mb-3">🦷</div>
                                        <p className="text-sm font-medium text-gray-500">Haz clic en el odontograma para agregar piezas</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            o usa <strong>"+ Agregar pieza"</strong> para ingresar manualmente
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ════ REGISTRO CLÍNICO ════════════════════════════ */}
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Registro de Atención</h4>

                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="motivo_consulta" value="Motivo de consulta *" />
                                        <TextInput
                                            id="motivo_consulta" name="motivo_consulta"
                                            value={form.motivo_consulta} onChange={handleChange}
                                            className="mt-1 block w-full"
                                            placeholder="Ej: Dolor en muela inferior derecha"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="sintomas" value="Síntomas" />
                                        <textarea
                                            id="sintomas" name="sintomas"
                                            value={form.sintomas} onChange={handleChange} rows={2}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                            placeholder="Ej: Inflamación, sensibilidad al frío y calor"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="diagnostico" value="Diagnóstico general *" />
                                            <textarea
                                                id="diagnostico" name="diagnostico"
                                                value={form.diagnostico} onChange={handleChange} rows={3}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                placeholder="Ej: Caries profunda en pieza 36"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="tratamiento" value="Tratamiento realizado *" />
                                            <textarea
                                                id="tratamiento" name="tratamiento"
                                                value={form.tratamiento} onChange={handleChange} rows={3}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                placeholder="Ej: Endodoncia, primera sesión completada"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="observaciones" value="Observaciones" />
                                        <textarea
                                            id="observaciones" name="observaciones"
                                            value={form.observaciones} onChange={handleChange} rows={2}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                            placeholder="Notas adicionales..."
                                        />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="proxima_cita_sugerida" value="Próxima cita sugerida" />
                                        <TextInput
                                            id="proxima_cita_sugerida" name="proxima_cita_sugerida"
                                            value={form.proxima_cita_sugerida} onChange={handleChange}
                                            className="mt-1 block w-full"
                                            placeholder="Ej: Control en 7 días"
                                        />
                                    </div>

                                    {/* Receta toggle */}
                                    <div className="border-t pt-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={generarReceta}
                                                onChange={e => setGenerarReceta(e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Generar receta médica
                                            </span>
                                        </label>
                                    </div>

                                    {generarReceta && (
                                        <div className="border rounded-lg p-4 bg-gray-50">
                                            <div className="flex justify-between items-center mb-3">
                                                <h5 className="font-medium text-gray-900">Medicamentos</h5>
                                                <button
                                                    type="button" onClick={agregarMed}
                                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                                >
                                                    + Agregar medicamento
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {form.medicamentos.map((med, i) => (
                                                    <div key={i} className="bg-white p-3 rounded border">
                                                        <div className="flex justify-between mb-2">
                                                            <span className="text-xs text-gray-500">Medicamento {i + 1}</span>
                                                            {form.medicamentos.length > 1 && (
                                                                <button onClick={() => quitarMed(i)} className="text-red-500 hover:text-red-700 text-xs">
                                                                    Quitar
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            <input type="text" placeholder="Nombre del medicamento *" value={med.medicamento}
                                                                onChange={e => updateMed(i, 'medicamento', e.target.value)}
                                                                className="md:col-span-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                            />
                                                            <input type="text" placeholder="Dosis (ej: 500mg)" value={med.dosis}
                                                                onChange={e => updateMed(i, 'dosis', e.target.value)}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                            />
                                                            <input type="text" placeholder="Frecuencia (ej: cada 8 hrs)" value={med.frecuencia}
                                                                onChange={e => updateMed(i, 'frecuencia', e.target.value)}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                            />
                                                            <input type="text" placeholder="Duración (ej: 7 días)" value={med.duracion}
                                                                onChange={e => updateMed(i, 'duracion', e.target.value)}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                            />
                                                            <input type="text" placeholder="Indicaciones especiales" value={med.indicaciones}
                                                                onChange={e => updateMed(i, 'indicaciones', e.target.value)}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                                    <button
                                        onClick={marcarNoAsistio}
                                        className="px-4 py-2 text-red-600 hover:text-red-800 font-medium text-sm"
                                    >
                                        Marcar como no asistió
                                    </button>
                                    <div className="flex gap-3 items-center">
                                        <Link href="/doctor/panel" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">
                                            Cancelar
                                        </Link>
                                        <PrimaryButton onClick={guardarAtencion} disabled={loading}>
                                            {loading ? 'Guardando...' : 'Guardar y Finalizar'}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Already attended */
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                ✓ Atendida
                            </span>
                            <p className="text-gray-500 mt-4">
                                Esta cita ya fue atendida. Puedes ver el registro en el historial del paciente.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ════ HISTORIAL MODAL ═════════════════════════════════════════════ */}
            <Modal show={mostrarHistorial} onClose={() => setMostrarHistorial(false)} maxWidth="2xl">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Historial de {patient?.nombre} {patient?.apellido}
                    </h3>
                    {historial?.length > 0 ? (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                            {historial.map(reg => (
                                <div key={reg.id} className="border rounded-lg p-4">
                                    <p className="font-medium text-gray-900">{reg.motivo_consulta}</p>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {new Date(reg.fecha).toLocaleDateString('es-BO')}
                                        {reg.doctor && ` • Dr(a). ${reg.doctor.nombre} ${reg.doctor.apellido}`}
                                    </p>
                                    <div className="text-sm space-y-1">
                                        <p><span className="font-medium">Diagnóstico:</span> {reg.diagnostico}</p>
                                        <p><span className="font-medium">Tratamiento:</span> {reg.tratamiento}</p>
                                        {reg.observaciones && (
                                            <p><span className="font-medium">Observaciones:</span> {reg.observaciones}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay atenciones previas registradas.</p>
                    )}
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton onClick={() => setMostrarHistorial(false)}>Cerrar</SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
