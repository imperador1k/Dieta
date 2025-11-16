'use client';

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Save, Ruler, Calendar as CalendarIcon, Weight, CircleDotDashed } from "lucide-react";
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

const MeasurementInput = ({ label, icon: Icon, value, onChange, placeholder, unit }: { label: string; icon: React.ElementType; value: number | undefined; onChange: (value: string) => void; placeholder: string, unit: string }) => (
    <div className="space-y-2">
        <Label className="text-sm flex items-center gap-2 text-muted-foreground"><Icon className="w-4 h-4"/>{label}</Label>
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
                <SheetHeader className="p-6 pb-4">
                    <SheetTitle className="text-2xl flex items-center gap-3"><Ruler /> Nova Medição</SheetTitle>
                    <SheetDescription>
                        Registe o seu peso e medidas para uma análise precisa da sua evolução.
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="date" className="text-sm flex items-center gap-2 text-muted-foreground"><CalendarIcon className="w-4 h-4"/>Data da Medição</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "w-full justify-start text-left font-normal h-12 text-base",
                                        !date && "text-muted-foreground"
                                        )}
                                    >
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
                            
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="weight" className="text-sm flex items-center gap-2 text-muted-foreground"><Weight className="w-4 h-4"/> Peso Corporal</Label>
                                <div className="flex items-baseline gap-2 p-3 rounded-lg bg-background/50 border-2 border-primary/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <Input 
                                        id="weight" 
                                        type="number"
                                        placeholder="75.5"
                                        value={measurement.weight || ''}
                                        onChange={e => updateMeasurement('weight', e.target.value)}
                                        className="text-3xl font-bold h-auto p-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 tracking-tighter"
                                    />
                                    <span className="text-xl font-semibold text-muted-foreground">kg</span>
                                </div>
                            </div>
                        </div>

                         <div className="space-y-4">
                            <h3 className="text-base font-semibold mb-3 flex items-center gap-2"><CircleDotDashed className="w-5 h-5 text-primary"/> Medidas Corporais</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <MeasurementInput label="Pescoço" icon={Ruler} value={measurement.neck} onChange={(v) => updateMeasurement('neck', v)} placeholder="38" unit="cm" />
                                <MeasurementInput label="Cintura" icon={Ruler} value={measurement.waist} onChange={(v) => updateMeasurement('waist', v)} placeholder="85" unit="cm" />
                                <MeasurementInput label="Anca" icon={Ruler} value={measurement.hips} onChange={(v) => updateMeasurement('hips', v)} placeholder="95" unit="cm" />
                                <p className="text-xs text-muted-foreground sm:col-span-2">A anca é opcional para homens. As medidas são usadas para estimar a % de gordura.</p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <Separator />
                <SheetFooter className="p-6 bg-background/80 backdrop-blur-sm">
                    <Button onClick={handleSave} className="w-full h-12 text-base"><Save className="mr-2"/> Guardar Medição</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
