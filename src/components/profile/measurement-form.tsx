'use client';

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Save, Ruler, Calendar as CalendarIcon, Weight } from "lucide-react";
import type { BodyMeasurement } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

interface MeasurementFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (measurement: BodyMeasurement) => void;
    latestMeasurement: BodyMeasurement | null;
}

export function MeasurementForm({ open, onOpenChange, onSave, latestMeasurement }: MeasurementFormProps) {
    const [measurement, setMeasurement] = useState<BodyMeasurement>({ date: new Date().toISOString() });
    const [date, setDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        if (open) {
            const initialData = latestMeasurement || { date: new Date().toISOString() };
            setMeasurement({ ...initialData, date: new Date().toISOString() });
            setDate(new Date());
        }
    }, [open, latestMeasurement]);
    
    useEffect(() => {
        if (date) {
            setMeasurement(prev => ({...prev, date: date.toISOString()}));
        }
    }, [date]);

    const updateMeasurement = (field: keyof Omit<BodyMeasurement, 'date'>, value: string) => {
        const numValue = value ? parseFloat(value) : undefined;
        setMeasurement(prev => ({ ...prev, [field]: numValue }));
    };

    const handleSave = () => {
        onSave(measurement);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md w-full flex flex-col p-0">
                <SheetHeader className="p-6">
                    <SheetTitle className="text-2xl flex items-center gap-3"><Ruler /> Nova Medição</SheetTitle>
                    <SheetDescription>
                        Registe o seu peso e medidas corporais para acompanhar a sua evolução.
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                             <Label htmlFor="date" className="text-base">Data da Medição</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight" className="text-base flex items-center gap-2"><Weight /> Peso (kg)</Label>
                                <Input 
                                    id="weight" 
                                    type="number"
                                    placeholder="Ex: 75.5"
                                    value={measurement.weight || ''}
                                    onChange={e => updateMeasurement('weight', e.target.value)}
                                    className="text-lg h-12"
                                />
                            </div>
                        </div>

                        <Separator />

                         <div>
                            <h3 className="text-lg font-semibold mb-3">Medidas Corporais (cm)</h3>
                             <div className="p-4 bg-muted/40 rounded-lg space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="neck">Pescoço</Label>
                                    <Input id="neck" type="number" placeholder="Ex: 38" value={measurement.neck || ''} onChange={(e) => updateMeasurement('neck', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="waist">Cintura</Label>
                                    <Input id="waist" type="number" placeholder="Ex: 85" value={measurement.waist || ''} onChange={(e) => updateMeasurement('waist', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hips">Anca</Label>
                                    <Input id="hips" type="number" placeholder="Ex: 95 (opcional para homens)" value={measurement.hips || ''} onChange={(e) => updateMeasurement('hips', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <Separator />
                <SheetFooter className="p-6 bg-background/80 backdrop-blur-sm">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} className="w-full"><Save className="mr-2"/> Guardar Medição</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
