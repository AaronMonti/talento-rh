'use client';

import { Card } from "@/app/components/ui/dashboard/Card";
import { Input } from "@/app/components/ui/dashboard/Input";
import { Select } from "@/app/components/ui/dashboard/Select";
import { Button } from "@/app/components/ui/dashboard/Button";
import { Eye } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { supabase } from "@/app/lib/supabase";

// Definimos los tipos
interface Application {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  empleo_titulo: string;
  empleo_id: string; // ← nuevo campo necesario
  fecha_postulacion: string;
}


export default function Postulaciones() {
  // Estados para la tabla
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCVs = async () => {
      setLoading(true);
  
      const { data, error } = await supabase
      .from("postulaciones")
      .select("id, nombre, apellidos, email, empleo_titulo, empleo_id, fecha_postulacion");
  
      if (error) {
        console.error("❌ Error al cargar los CVs:", error.message);
      } else {
        setApplications(data as Application[]);
      }
  
      setLoading(false);
    };
  
    fetchCVs();
  }, []);

  // Columnas memoizadas
  const columns = useMemo<ColumnDef<Application>[]>(() => [
    {
      accessorKey: 'nombre',
      header: "Candidato",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.nombre} {row.original.apellidos}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'empleo_titulo',
      header: "Posición",
    },
    {
      accessorKey: 'fecha_postulacion',
      header: "Fecha",
      cell: ({ row }) =>
        format(new Date(row.getValue('fecha_postulacion')), "d 'de' MMMM, yyyy", { locale: es }),
    },
    {
      id: 'actions',
      header: () => <div className="text-right font-bold">Acciones</div>,
      cell: ({ row }) => {
        const app = row.original;
    
        const handleDelete = async () => {
          if (confirm(`¿Estás seguro de eliminar la postulación de ${app.nombre}?`)) {
            const { error } = await supabase
              .from('postulaciones')
              .delete()
              .eq('id', app.id);
    
            if (error) {
              console.error('❌ Error al eliminar:', error.message);
            } else {
              setApplications(prev => prev.filter(a => a.id !== app.id));
            }
          }
        };
    
        return (
          <div className="text-right flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = `/empleos/${app.empleo_id}`}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver empleo
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </div>
        );
      }
    }
  ], []);

  // Configuración de la tabla memoizada
  const table = useReactTable({
    data: applications,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Manejadores de eventos memoizados
  const handleGlobalFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    if (value === 'all') {
      setColumnFilters(prev => prev.filter(f => f.id !== 'status'));
    } else {
      setColumnFilters(prev => [
        ...prev.filter(f => f.id !== 'status'),
        { id: 'status', value }
      ]);
    }
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    table.setPageSize(Number(value));
  }, [table]);

  if (loading) {
    return (
      <div className="p-8 text-center text-lg text-primary">
        Cargando postulaciones...
      </div>
    );
  }
  

  return (
    <div className="space-y-8">
      <Card className="!p-4">
        <h1 className="text-3xl font-bold text-primary">
          Postulaciones
        </h1>
      </Card>

      <Card className="!p-6">
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar por nombre, posición o email..."
            value={globalFilter ?? ''}
            onChange={handleGlobalFilterChange}
            className="flex-1"
          />
          <Select
            options={[
              { label: "Todas", value: "all" },
              { label: "En revisión", value: "En revisión" },
              { label: "Entrevista", value: "Entrevista" },
              { label: "Rechazada", value: "Rechazada" },
              { label: "Aceptada", value: "Aceptada" }
            ]}
            onChange={handleStatusFilterChange}
            placeholder="Filtrar por estado"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-primary">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-3 px-4 text-left text-primary">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-tertiary/5 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </span>
            <Select
              options={[
                { label: '10 por página', value: '10' },
                { label: '20 por página', value: '20' },
                { label: '30 por página', value: '30' },
                { label: '40 por página', value: '40' },
                { label: '50 por página', value: '50' },
              ]}
              value={table.getState().pagination.pageSize.toString()}
              onChange={handlePageSizeChange}
            />
          </div>
        </div>
      </Card>
    </div>
  );
} 