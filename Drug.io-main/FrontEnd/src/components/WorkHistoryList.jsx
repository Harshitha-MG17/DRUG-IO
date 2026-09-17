import React from 'react';
import { motion } from 'framer-motion';

const WorkHistoryList = ({ history }) => {
    if (!history || history.length === 0) {
        return <p className="text-gray-500">No history found.</p>;
    }

    return (
        <div className="space-y-4">
            {history.map((item, index) => {
                const results = item.results || {};
                const modulesRun = results.modules_run || { admet: true, dti: false, synergy: false };

                return (
                    <motion.div
                        key={item._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-gray-900 rounded border border-gray-800 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-mono text-cyan-300">{item.smiles || "Unknown Molecule"}</p>
                            <p className="text-sm text-gray-500">
                                {item.created_at ? new Date(item.created_at).toLocaleString() : "Date unknown"}
                            </p>
                        </div>

                        <div className="text-right flex flex-col items-end gap-2">
                            {/* Computed Status Text */}
                            {(() => {
                                const { admet, dti, synergy } = modulesRun;
                                const activeModules = [admet, dti, synergy].filter(Boolean).length;
                                let statusText = "Analysis Completed";

                                if (activeModules === 3) statusText = "Full Analysis Completed";
                                else if (activeModules > 1) statusText = "Multi-Module Analysis";
                                else if (admet) statusText = "ADMET Completed";
                                else if (dti) statusText = "AI Drug (DTI) Completed";
                                else if (synergy) statusText = "Drug Combination Completed";

                                return <span className="text-sm font-semibold text-gray-300 mb-1">{statusText}</span>;
                            })()}

                            <div className="flex gap-2">
                                {modulesRun.admet && (
                                    <span className="text-xs px-2 py-1 rounded bg-green-900/50 text-green-300 border border-green-700">
                                        ADMET
                                    </span>
                                )}
                                {modulesRun.dti && (
                                    <span className="text-xs px-2 py-1 rounded bg-purple-900/50 text-purple-300 border border-purple-700">
                                        DTI
                                    </span>
                                )}
                                {modulesRun.synergy && (
                                    <span className="text-xs px-2 py-1 rounded bg-blue-900/50 text-blue-300 border border-blue-700">
                                        Synergy
                                    </span>
                                )}
                            </div>

                            {!results.modules_run && results.type && (
                                <span className="text-xs text-gray-500 mt-1 block">
                                    Legacy: {results.type}
                                </span>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default WorkHistoryList;
