'use client';

import React, { useState, useEffect } from 'react';
import { TestTube, Zap, Activity, CheckCircle, XCircle, Clock, BarChart3, ArrowRight, Brain, AlertCircle, Play, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runTestSuite, runSingleTest, type TestSuiteResult, type TestResult, type TestType } from '@/actions/course_020_testing/test_agent';
import { PRESET_TESTS } from '@/actions/course_020_testing/presets';
import { getOllamaModels } from '@/actions/course_004_state_management/chat';

const TEST_TYPES: { value: TestType; label: string; color: string; description: string }[] = [
    { value: 'unit', label: 'Unit', color: 'blue', description: 'Test individual components' },
    { value: 'integration', label: 'Integration', color: 'emerald', description: 'Test component interactions' },
    { value: 'validation', label: 'Validation', color: 'purple', description: 'Test output constraints' },
    { value: 'regression', label: 'Regression', color: 'orange', description: 'Test consistency over time' }
];

export function TestingLab() {
    const [mode, setMode] = useState<'suite' | 'single'>('suite');
    const [suiteType, setSuiteType] = useState<'basic' | 'comprehensive'>('basic');
    const [selectedPreset, setSelectedPreset] = useState(0);
    const [model, setModel] = useState("llama3.2");
    const [models, setModels] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [suiteResult, setSuiteResult] = useState<TestSuiteResult | null>(null);
    const [singleResult, setSingleResult] = useState<TestResult | null>(null);

    useEffect(() => {
        const checkModels = async () => {
            try {
                const available = await getOllamaModels();
                setModels(available);
                if (available.length > 0) setModel(available[0]);
            } catch (err) { console.error(err); }
        };
        checkModels();
    }, []);

    const handleRunSuite = async () => {
        setLoading(true);
        setSuiteResult(null);
        setSingleResult(null);

        try {
            const result = await runTestSuite(suiteType, model);
            setSuiteResult(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRunSingle = async () => {
        setLoading(true);
        setSingleResult(null);
        setSuiteResult(null);

        try {
            const result = await runSingleTest(PRESET_TESTS[selectedPreset], model);
            setSingleResult(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[950px] sticky top-6">

            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                        <TestTube className="w-5 h-5 text-indigo-500" />
                        <h3>Agent Testing Lab</h3>
                    </div>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-600 dark:text-zinc-300 max-w-[120px]"
                    >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => setMode('suite')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${mode === 'suite'
                                ? 'bg-indigo-500 text-white border-indigo-600 shadow-md'
                                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                            }`}
                    >
                        <BarChart3 className="w-3 h-3" />
                        Test Suite
                    </button>
                    <button
                        onClick={() => setMode('single')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${mode === 'single'
                                ? 'bg-indigo-500 text-white border-indigo-600 shadow-md'
                                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                            }`}
                    >
                        <Target className="w-3 h-3" />
                        Single Test
                    </button>
                </div>

                {/* Suite Type Selector (for suite mode) */}
                {mode === 'suite' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSuiteType('basic')}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${suiteType === 'basic'
                                    ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                                }`}
                        >
                            Basic Suite (3 tests)
                        </button>
                        <button
                            onClick={() => setSuiteType('comprehensive')}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${suiteType === 'comprehensive'
                                    ? 'bg-purple-500 text-white border-purple-600 shadow-sm'
                                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                                }`}
                        >
                            Comprehensive (6 tests)
                        </button>
                    </div>
                )}

                {/* Preset Selector (for single mode) */}
                {mode === 'single' && (
                    <div className="grid grid-cols-2 gap-2">
                        {PRESET_TESTS.slice(0, 4).map((test, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedPreset(i)}
                                className={`py-2 px-2 rounded-lg text-xs font-medium transition-all border text-left ${selectedPreset === i
                                        ? 'bg-indigo-500 text-white border-indigo-600 shadow-sm'
                                        : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                                    }`}
                            >
                                <div className="font-bold text-[10px]">{test.name}</div>
                                <div className={`text-[9px] ${selectedPreset === i ? 'text-indigo-100' : 'text-zinc-500'}`}>
                                    {test.type}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-black/20">

                {/* Run Button */}
                <button
                    onClick={mode === 'suite' ? handleRunSuite : handleRunSingle}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 mb-6"
                >
                    {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {loading ? 'Running Tests...' : mode === 'suite' ? 'Run Test Suite' : 'Run Single Test'}
                </button>

                {/* Results Area */}
                <AnimatePresence>
                    {/* Suite Results */}
                    {suiteResult && mode === 'suite' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Summary Card */}
                            <div className={`border rounded-xl overflow-hidden shadow-lg ${suiteResult.success
                                    ? 'border-emerald-200 dark:border-emerald-800'
                                    : 'border-red-200 dark:border-red-800'
                                }`}>
                                <div className={`p-4 ${suiteResult.success
                                        ? 'bg-emerald-50 dark:bg-emerald-900/10'
                                        : 'bg-red-50 dark:bg-red-900/10'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold flex items-center gap-2">
                                            {suiteResult.success ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                            <span className={suiteResult.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}>
                                                {suiteResult.success ? 'All Tests Passed!' : 'Some Tests Failed'}
                                            </span>
                                        </h4>
                                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {suiteResult.executionTime}ms
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 grid grid-cols-4 gap-3 bg-white dark:bg-zinc-900">
                                    <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{suiteResult.totalTests}</div>
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Total</div>
                                    </div>
                                    <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                        <div className="text-2xl font-bold text-emerald-600">{suiteResult.passed}</div>
                                        <div className="text-[10px] text-emerald-600 uppercase tracking-wider">Passed</div>
                                    </div>
                                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">{suiteResult.failed}</div>
                                        <div className="text-[10px] text-red-600 uppercase tracking-wider">Failed</div>
                                    </div>
                                    <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                        <div className="text-2xl font-bold text-zinc-600">{Math.round((suiteResult.passed / suiteResult.totalTests) * 100)}%</div>
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Pass Rate</div>
                                    </div>
                                </div>
                            </div>

                            {/* Coverage Diagram */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                                <h5 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase mb-4">Test Coverage by Type</h5>
                                <div className="grid grid-cols-4 gap-3">
                                    {TEST_TYPES.map((type, i) => {
                                        const count = suiteResult.coverage[`${type.value}Tests` as keyof typeof suiteResult.coverage];
                                        return (
                                            <div key={i} className="text-center">
                                                <div className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-end justify-center p-2 mb-2">
                                                    <div
                                                        className={`w-full rounded-t transition-all bg-${type.color}-500`}
                                                        style={{ height: `${(count / suiteResult.totalTests) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="text-xs font-bold">{count}</div>
                                                <div className="text-[10px] text-zinc-500">{type.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Individual Test Results */}
                            <div className="space-y-3">
                                <h5 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase">Test Results</h5>
                                {suiteResult.results.map((result, i) => (
                                    <div key={i} className={`border rounded-lg overflow-hidden ${result.passed
                                            ? 'border-emerald-200 dark:border-emerald-800'
                                            : 'border-red-200 dark:border-red-800'
                                        }`}>
                                        <div className={`p-3 flex items-center justify-between ${result.passed
                                                ? 'bg-emerald-50/50 dark:bg-emerald-900/10'
                                                : 'bg-red-50/50 dark:bg-red-900/10'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {result.passed ? (
                                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-600" />
                                                )}
                                                <span className="text-xs font-bold">{result.testCase.name}</span>
                                                <span className={`text-[9px] px-2 py-0.5 rounded ${result.testCase.type === 'unit' ? 'bg-blue-100 text-blue-700' :
                                                        result.testCase.type === 'integration' ? 'bg-emerald-100 text-emerald-700' :
                                                            result.testCase.type === 'validation' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {result.testCase.type}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-zinc-500">{result.executionTime}ms</span>
                                        </div>
                                        {!result.passed && result.error && (
                                            <div className="p-3 bg-red-50/30 dark:bg-red-900/5 border-t border-red-200 dark:border-red-800">
                                                <div className="text-[10px] text-red-600 dark:text-red-400 flex items-start gap-2">
                                                    <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                                                    <span>{result.error}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Test Workflow Diagram */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6 text-center">
                                    Test Execution Workflow
                                </h4>

                                <div className="flex flex-col items-center gap-2 text-xs font-mono">
                                    <span className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded text-zinc-500">Test Suite</span>
                                    <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                    <div className="relative p-3 border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 w-full max-w-md">
                                        <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-blue-600 border border-blue-200 rounded font-bold">Test Selection</div>
                                        <div className="text-center text-blue-600 dark:text-blue-400 text-[10px]">
                                            {suiteResult.totalTests} test cases loaded
                                        </div>
                                    </div>

                                    <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                    <div className="relative p-3 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 w-full max-w-md">
                                        <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-indigo-600 border border-indigo-200 rounded font-bold">Agent Execution</div>
                                        <div className="flex items-center gap-2 justify-center">
                                            <Brain className="w-3 h-3 text-indigo-500" />
                                            <span className="text-indigo-600 dark:text-indigo-400 text-[10px]">Running with {model}</span>
                                        </div>
                                    </div>

                                    <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                    <div className="relative p-3 border-2 border-dashed border-purple-300 dark:border-purple-800 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 w-full max-w-md">
                                        <div className="absolute -top-3 left-2 bg-white dark:bg-zinc-900 text-[9px] px-1 text-purple-600 border border-purple-200 rounded font-bold">Validation</div>
                                        <div className="text-center text-purple-600 dark:text-purple-400 text-[10px]">
                                            Pattern matching & constraints
                                        </div>
                                    </div>

                                    <ArrowRight className="w-4 h-4 text-zinc-300 rotate-90" />

                                    <span className={`px-2 py-1 border rounded font-bold ${suiteResult.success
                                            ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-600'
                                            : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600'
                                        }`}>
                                        {suiteResult.passed}/{suiteResult.totalTests} Passed
                                    </span>
                                </div>
                            </div>

                        </motion.div>
                    )}

                    {/* Single Test Result */}
                    {singleResult && mode === 'single' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Test Info */}
                            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4">
                                <h5 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 mb-3">Test Case Details</h5>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">Name:</span>
                                        <span className="font-bold">{singleResult.testCase.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">Type:</span>
                                        <span className="font-bold capitalize">{singleResult.testCase.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">Input:</span>
                                        <span className="font-mono text-[10px]">{singleResult.testCase.input}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Result Card */}
                            <div className={`border rounded-xl overflow-hidden shadow-lg ${singleResult.passed
                                    ? 'border-emerald-200 dark:border-emerald-800'
                                    : 'border-red-200 dark:border-red-800'
                                }`}>
                                <div className={`p-4 ${singleResult.passed
                                        ? 'bg-emerald-50 dark:bg-emerald-900/10'
                                        : 'bg-red-50 dark:bg-red-900/10'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold flex items-center gap-2">
                                            {singleResult.passed ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                            <span className={singleResult.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}>
                                                {singleResult.passed ? 'Test Passed' : 'Test Failed'}
                                            </span>
                                        </h4>
                                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {singleResult.executionTime}ms
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white dark:bg-zinc-900">
                                    <h6 className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Actual Output</h6>
                                    <div className="text-sm text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                        {singleResult.actualOutput}
                                    </div>

                                    {!singleResult.passed && singleResult.error && (
                                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                                            <div className="text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="font-bold mb-1">Error:</div>
                                                    <div>{singleResult.error}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
