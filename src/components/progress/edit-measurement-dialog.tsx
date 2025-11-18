'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, Trash2, Calendar as CalendarIcon, Weight, Ruler } from "lucide-react";
import type { BodyMeasurement } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar } from "../ui/calendar";

interface EditMeasurementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    measurement: BodyMeasurement;
    onSave: (measurement: BodyMeasurement) => void;
    onDelete: (date: string) => void;
}

const MeasurementInput = ({ 
    label, 
    icon: Icon, 
    value, 
    onChange, 
    placeholder, 
    unit 
}: { 
    label: string; 
    icon: React.ElementType; 
    value: number | undefined; 
    onChange: (value: string) => void; 
    placeholder: string; 
    unit: string;
}) => (
    <div className="space-y-2">
        <Label className="text-sm flex items-center gap-2 text-muted-foreground">
            <Icon className="w-4 h-4"/>{label}
        </Label>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-muted/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Input 
                type="number"
                placeholder={placeholder}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className="text-base h-auto p-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <span className="font-semibold text-muted-foreground">{unit}</span>
        </div>
    </div>
);

export function EditMeasurementDialog({ 
    open, 
    onOpenChange, 
    measurement, 
    onSave, 
    onDelete 
}: EditMeasurementDialogProps) {
    const [editedMeasurement, setEditedMeasurement] = useState<BodyMeasurement>(measurement);
    const [date, setDate] = useState<Date | undefined>(new Date(measurement.date));

    useEffect(() => {
        if (open) {
            setEditedMeasurement(measurement);
            setDate(new Date(measurement.date));
        }
    }, [open, measurement]);
    
    useEffect(() => {
        if (date) {
            setEditedMeasurement(prev => ({...prev, date: date.toISOString()}));
        }
    }, [date]);

    const updateMeasurement = (field: keyof Omit<BodyMeasurement, 'date'>, value: string) => {
        const numValue = value ? parseFloat(value) : undefined;
        setEditedMeasurement(prev => ({ ...prev, [field]: numValue }));
    };

    const handleSave = () => {
        onSave(editedMeasurement);
        onOpenChange(false);
    };

    const handleDelete = () => {
        if (confirm('Tem certeza que deseja eliminar esta medição?')) {
            onDelete(measurement.date);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-full flex flex-col p-0">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="text-2xl flex items-center gap-3">
                        <Ruler /> Editar Medição
                    </DialogTitle>
                </DialogHeader>
                <Separator />
                <div className="flex-1 p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm flex items-center gap-2 text-muted-foreground">
                            <CalendarIcon className="w-4 h-4"/>Data da Medição
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-12 text-base",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    {date ? format(date, "PPP", { locale: pt }) : <span>Selecione uma data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    locale={pt}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="text-sm flex items-center gap-2 text-muted-foreground">
                                <Weight className="w-4 h-4"/> Peso Corporal
                            </Label>
                            <div className="flex items-baseline gap-2 p-3 rounded-lg bg-background/50 border-2 border-primary/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                <Input 
                                    id="weight" 
                                    type="number"
                                    placeholder="75.5"
                                    value={editedMeasurement.weight || ''}
                                    onChange={e => updateMeasurement('weight', e.target.value)}
                                    className="text-3xl font-bold h-auto p-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 tracking-tighter"
                                />
                                <span className="text-xl font-semibold text-muted-foreground">kg</span>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-base font-semibold">Medidas Corporais</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <MeasurementInput 
                                    label="Pescoço" 
                                    icon={Ruler} 
                                    value={editedMeasurement.neck} 
                                    onChange={(v) => updateMeasurement('neck', v)} 
                                    placeholder="38" 
                                    unit="cm" 
                                />
                                <MeasurementInput 
                                    label="Cintura" 
                                    icon={Ruler} 
                                    value={editedMeasurement.waist} 
                                    onChange={(v) => updateMeasurement('waist', v)} 
                                    placeholder="85" 
                                    unit="cm" 
                                />
                                <MeasurementInput 
                                    label="Anca" 
                                    icon={Ruler} 
                                    value={editedMeasurement.hips} 
                                    onChange={(v) => updateMeasurement('hips', v)} 
                                    placeholder="95" 
                                    unit="cm" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="p-6 bg-background/80 backdrop-blur-sm flex flex-col sm:flex-row gap-3">
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        className="flex-1 h-12"
                    >
                        <Trash2 className="mr-2 w-4 h-4" /> Eliminar
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        className="flex-1 h-12"
                    >
                        <Save className="mr-2 w-4 h-4" /> Guardar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}